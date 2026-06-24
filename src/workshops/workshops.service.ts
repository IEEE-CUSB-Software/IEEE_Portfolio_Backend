import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Workshop } from './entities/workshop.entity';
import { WorkshopRegistration, WorkshopRegistrationStatus } from './entities/workshop-registration.entity';
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

  private async enrichWorkshopWithDetails(workshop: Workshop, currentUser?: User) {
    const acceptedCount = await this.registrationsRepository.count({
      where: {
        workshop_id: workshop.id,
        status: In([
          WorkshopRegistrationStatus.ACCEPTED,
          WorkshopRegistrationStatus.ATTENDED,
        ]),
      },
    });

    const remainingSpots = workshop.capacity - acceptedCount;
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

  async findAll(page: number = 1, limit: number = 10, currentUser?: User) {
    const skip = (page - 1) * limit;

    const [workshops, total] = await this.workshopsRepository.findAndCount({
      skip,
      take: limit,
      order: { start_time: 'ASC' },
      relations: ['images', 'instructors'],
    });

    const enrichedWorkshops = await Promise.all(
      workshops.map((workshop) => this.enrichWorkshopWithDetails(workshop, currentUser)),
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
}
