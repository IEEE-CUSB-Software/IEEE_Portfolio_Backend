import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Workshop } from './entities/workshop.entity';
import {
  WorkshopRegistration,
  WorkshopRegistrationStatus,
} from './entities/workshop-registration.entity';
import { User } from 'src/users/entities/user.entity';
import { ERROR_MESSAGES } from 'src/constants/swagger-messages';

@Injectable()
export class WorkshopsService {
  constructor(
    @InjectRepository(Workshop)
    private readonly workshopsRepository: Repository<Workshop>,
    @InjectRepository(WorkshopRegistration)
    private readonly registrationsRepository: Repository<WorkshopRegistration>,
  ) {}

  private async enrichWorkshopWithDetails(
    workshop: Workshop,
    currentUser?: User,
  ) {
    const acceptedCount = await this.registrationsRepository.count({
      where: {
        workshop_id: workshop.id,
        status: In([
          WorkshopRegistrationStatus.ACCEPTED,
          WorkshopRegistrationStatus.ATTENDED,
        ]),
      },
    });

    const remainingSpots = Math.max(0, workshop.capacity - acceptedCount);
    const is_full = remainingSpots <= 0;

    const enrichedWorkshop: any = {
      ...workshop,
      remainingSpots,
      is_full,
    };

    if (currentUser) {
      const userRegistration = await this.registrationsRepository.findOne({
        where: {
          workshop_id: workshop.id,
          user_id: currentUser.id,
          status: In([
            WorkshopRegistrationStatus.PENDING,
            WorkshopRegistrationStatus.ACCEPTED,
            WorkshopRegistrationStatus.ATTENDED,
          ]),
        },
      });

      enrichedWorkshop.is_registered = !!userRegistration;
      enrichedWorkshop.registration_id = userRegistration?.id || null;
      enrichedWorkshop.registration_status = userRegistration?.status || null;
    }

    return enrichedWorkshop;
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
    currentUser?: User,
    search?: string,
    location?: string,
  ) {
    const skip = (page - 1) * limit;

    const qb = this.workshopsRepository
      .createQueryBuilder('workshop')
      .leftJoinAndSelect('workshop.images', 'images')
      .leftJoinAndSelect('workshop.instructors', 'instructors')
      .orderBy('workshop.start_time', 'ASC')
      .skip(skip)
      .take(limit);

    if (search) {
      qb.andWhere(
        '(workshop.title ILIKE :search OR workshop.description ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    if (location) {
      qb.andWhere('workshop.location ILIKE :location', {
        location: `%${location}%`,
      });
    }

    const [workshops, total] = await qb.getManyAndCount();

    const enrichedWorkshops = await Promise.all(
      workshops.map((workshop) =>
        this.enrichWorkshopWithDetails(workshop, currentUser),
      ),
    );

    return {
      data: enrichedWorkshops,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string, currentUser?: User) {
    const workshop = await this.workshopsRepository.findOne({
      where: { id },
      relations: ['images', 'instructors'],
    });

    if (!workshop) {
      throw new NotFoundException(ERROR_MESSAGES.WORKSHOP_NOT_FOUND);
    }

    return this.enrichWorkshopWithDetails(workshop, currentUser);
  }

  async register(workshopId: string, currentUser: User) {
    const workshop = await this.workshopsRepository.findOne({
      where: { id: workshopId },
    });

    if (!workshop) {
      throw new NotFoundException(ERROR_MESSAGES.WORKSHOP_NOT_FOUND);
    }

    if (new Date() > workshop.registration_deadline) {
      throw new BadRequestException(
        ERROR_MESSAGES.WORKSHOP_REGISTRATION_CLOSED,
      );
    }

    const existingRegistration = await this.registrationsRepository.findOne({
      where: { workshop_id: workshopId, user_id: currentUser.id },
    });

    if (
      existingRegistration &&
      existingRegistration.status !== WorkshopRegistrationStatus.CANCELLED &&
      existingRegistration.status !== WorkshopRegistrationStatus.REJECTED
    ) {
      throw new ConflictException(ERROR_MESSAGES.WORKSHOP_ALREADY_REGISTERED);
    }

    if (existingRegistration) {
      existingRegistration.status = WorkshopRegistrationStatus.PENDING;
      return this.registrationsRepository.save(existingRegistration);
    }

    const registration = this.registrationsRepository.create({
      workshop_id: workshopId,
      user_id: currentUser.id,
      status: WorkshopRegistrationStatus.PENDING,
    });

    return this.registrationsRepository.save(registration);
  }

  async cancelRegistration(workshopId: string, currentUser: User) {
    const registration = await this.registrationsRepository.findOne({
      where: { workshop_id: workshopId, user_id: currentUser.id },
    });

    if (!registration) {
      throw new NotFoundException(
        ERROR_MESSAGES.WORKSHOP_REGISTRATION_NOT_FOUND,
      );
    }

    if (
      registration.status !== WorkshopRegistrationStatus.PENDING &&
      registration.status !== WorkshopRegistrationStatus.ACCEPTED
    ) {
      throw new BadRequestException(
        ERROR_MESSAGES.WORKSHOP_REGISTRATION_CANNOT_BE_CANCELLED,
      );
    }

    registration.status = WorkshopRegistrationStatus.CANCELLED;
    await this.registrationsRepository.save(registration);

    return registration;
  }
}
