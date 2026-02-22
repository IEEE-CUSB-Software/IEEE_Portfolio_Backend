import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Event } from 'src/events/entities/event.entity';
import {
  EventRegistration,
  EventRegistrationStatus,
} from 'src/events/entities/event-registration.entity';
import { User } from 'src/users/entities/user.entity';
import { ERROR_MESSAGES } from 'src/constants/swagger-messages';
import { CreateEventDto } from 'src/admin/events/dto/create-event.dto';
import { UpdateEventDto } from 'src/admin/events/dto/update-event.dto';

@Injectable()
export class AdminEventsService {
  constructor(
    @InjectRepository(Event)
    private readonly eventsRepository: Repository<Event>,
    @InjectRepository(EventRegistration)
    private readonly registrationsRepository: Repository<EventRegistration>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  private validateEventTimes(
    start_time: Date,
    end_time: Date,
    registration_deadline: Date,
  ) {
    if (start_time >= end_time) {
      throw new BadRequestException(ERROR_MESSAGES.EVENT_INVALID_TIME_RANGE);
    }

    if (registration_deadline > start_time) {
      throw new BadRequestException(ERROR_MESSAGES.EVENT_INVALID_TIME_RANGE);
    }
  }

  async create(createEventDto: CreateEventDto, currentUser: User) {
    const start_time = new Date(createEventDto.start_time);
    const end_time = new Date(createEventDto.end_time);
    const registration_deadline = new Date(
      createEventDto.registration_deadline,
    );

    this.validateEventTimes(start_time, end_time, registration_deadline);

    const event = this.eventsRepository.create({
      ...createEventDto,
      start_time,
      end_time,
      registration_deadline,
      created_by: currentUser.id,
    });

    return this.eventsRepository.save(event);
  }

  async update(id: string, updateEventDto: UpdateEventDto) {
    const event = await this.eventsRepository.preload({
      id,
      ...updateEventDto,
      start_time: updateEventDto.start_time
        ? new Date(updateEventDto.start_time)
        : undefined,
      end_time: updateEventDto.end_time
        ? new Date(updateEventDto.end_time)
        : undefined,
      registration_deadline: updateEventDto.registration_deadline
        ? new Date(updateEventDto.registration_deadline)
        : undefined,
    });

    if (!event) {
      throw new NotFoundException(ERROR_MESSAGES.EVENT_NOT_FOUND);
    }

    if (event.start_time && event.end_time && event.registration_deadline) {
      this.validateEventTimes(
        event.start_time,
        event.end_time,
        event.registration_deadline,
      );
    }

    return this.eventsRepository.save(event);
  }

  async remove(id: string) {
    const result = await this.eventsRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(ERROR_MESSAGES.EVENT_NOT_FOUND);
    }

    return {
        success: true,
    };
  }

  async getEventRegistrations(
    eventId: string,
    page: number = 1,
    limit: number = 10,
  ) {
    const event = await this.eventsRepository.findOne({
      where: { id: eventId },
    });

    if (!event) {
      throw new NotFoundException(ERROR_MESSAGES.EVENT_NOT_FOUND);
    }

    const skip = (page - 1) * limit;

    const [registrations, total] =
      await this.registrationsRepository.findAndCount({
        where: { event_id: eventId },
        relations: ['user'],
        skip,
        take: limit,
        order: { created_at: 'DESC' },
      });

    return {
      data: registrations,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async updateRegistrationStatus(
    eventId: string,
    registrationId: string,
    status: EventRegistrationStatus
  ) {
    const registration = await this.registrationsRepository.findOne({
      where: { id: registrationId, event_id: eventId },
    });

    if (!registration) {
      throw new NotFoundException(ERROR_MESSAGES.EVENT_REGISTRATION_NOT_FOUND);
    }

    registration.status = status;
    return this.registrationsRepository.save(registration);
  }

  async bulkRegisterUsers(
    eventId: string,
    userIds: string[],
  ): Promise<EventRegistration[]> {
    const event = await this.eventsRepository.findOne({
      where: { id: eventId },
    });

    if (!event) {
      throw new NotFoundException(ERROR_MESSAGES.EVENT_NOT_FOUND);
    }

    const users = await this.usersRepository.find({
      where: { id: In(userIds) },
    });
    if (users.length !== userIds.length) {
      throw new BadRequestException(ERROR_MESSAGES.USER_OR_MORE_USERS_NOT_FOUND);
    }

    const existingRegistrations = await this.registrationsRepository.find({
      where: {
        event_id: eventId,
        user_id: In(userIds),
      },
    });

    const registeredCount = await this.registrationsRepository.count({
      where: {
        event_id: eventId,
        status: In([
          EventRegistrationStatus.REGISTERED,
          EventRegistrationStatus.ATTENDED,
        ]),
      },
    });

    const newRegistrations: EventRegistration[] = [];
    const updatedRegistrations: EventRegistration[] = [];

    for (const userId of userIds) {
      const existingReg = existingRegistrations.find(
        (reg) => reg.user_id === userId,
      );

      if (existingReg) {
        // Update existing cancelled registration
        if (existingReg.status === EventRegistrationStatus.CANCELLED) {
          existingReg.status = EventRegistrationStatus.REGISTERED;
          updatedRegistrations.push(existingReg);
        }
      } else {
        // Create new registration
        const registration = this.registrationsRepository.create({
          event_id: eventId,
          user_id: userId,
          status: EventRegistrationStatus.REGISTERED,
        });
        newRegistrations.push(registration);
      }
    }

    // Calculate how many new spots are needed
    // no check for capaciry for admins
    const newRegistrationsCount = newRegistrations.length + updatedRegistrations.length;
    const totalRegisteredAfter = registeredCount + newRegistrationsCount;
    event.capacity = totalRegisteredAfter;
    await this.eventsRepository.save(event);

    const saved = await this.registrationsRepository.save([
      ...newRegistrations,
      ...updatedRegistrations,
    ]);

    return saved;
  }
}
