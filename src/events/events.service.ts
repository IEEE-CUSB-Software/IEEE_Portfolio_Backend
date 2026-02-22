import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Event } from './entities/event.entity';
import {
  EventRegistration,
  EventRegistrationStatus,
} from './entities/event-registration.entity';
import { User } from 'src/users/entities/user.entity';
import { ERROR_MESSAGES } from 'src/constants/swagger-messages';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private readonly eventsRepository: Repository<Event>,
    @InjectRepository(EventRegistration)
    private readonly registrationsRepository: Repository<EventRegistration>,
  ) {}

  // is_full / remainingSpots / is_registered / registration_id
  private async enrichEventWithDetails(event: Event, currentUser?: User) {
    const registeredCount = await this.registrationsRepository.count({
      where: {
        event_id: event.id,
        status: In([
          EventRegistrationStatus.REGISTERED,
          EventRegistrationStatus.ATTENDED,
        ]),
      },
    });

    const remainingSpots = event.capacity - registeredCount;
    const is_full = remainingSpots <= 0;

    const enrichedEvent: any = {
      ...event,
      remainingSpots,
      is_full,
    };

    // Add user-specific registration info if authenticated
    if (currentUser) {
      const userRegistration = await this.registrationsRepository.findOne({
        where: {
          event_id: event.id,
          user_id: currentUser.id,
          status: In([
            EventRegistrationStatus.REGISTERED,
            EventRegistrationStatus.ATTENDED,
            EventRegistrationStatus.WAITLISTED,
          ]),
        },
      });

      enrichedEvent.is_registered = !!userRegistration;
      enrichedEvent.registration_id = userRegistration?.id || null;
    }

    return enrichedEvent;
  }

  private async popOneWaitlistedToRegistered(eventId: string) {
    const [waitlisted] = await this.registrationsRepository.find({
      where: {
        event_id: eventId,
        status: EventRegistrationStatus.WAITLISTED,
      },
      order: { created_at: 'ASC' },
      take: 1,
    });

    if (waitlisted) {
      waitlisted.status = EventRegistrationStatus.REGISTERED;
      await this.registrationsRepository.save(waitlisted);

      // TODO: Send notification to user about registration update
    }
  }

  async findAll(page: number = 1, limit: number = 10, currentUser?: User) {
    const skip = (page - 1) * limit;

    const [events, total] = await this.eventsRepository.findAndCount({
      skip,
      take: limit,
      order: { start_time: 'ASC' },
    });

    // Enrich events with capacity and registration details
    const enrichedEvents = await Promise.all(
      events.map((event) => this.enrichEventWithDetails(event, currentUser)),
    );

    return {
      data: enrichedEvents,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string, currentUser?: User) {
    const event = await this.eventsRepository.findOne({
      where: { id },
    });

    if (!event) {
      throw new NotFoundException(ERROR_MESSAGES.EVENT_NOT_FOUND);
    }

    if (currentUser) {
      return this.enrichEventWithDetails(event, currentUser);
    }

    return event;
  }

  async register(eventId: string, currentUser: User) {
    const event = await this.eventsRepository.findOne({
      where: { id: eventId },
    });

    if (!event) {
      throw new NotFoundException(ERROR_MESSAGES.EVENT_NOT_FOUND);
    }

    if (new Date() > event.registration_deadline) {
      throw new BadRequestException(ERROR_MESSAGES.EVENT_REGISTRATION_CLOSED);
    }

    const existingRegistration = await this.registrationsRepository.findOne({
      where: { event_id: eventId, user_id: currentUser.id },
    });

    if (
      existingRegistration &&
      existingRegistration.status !== EventRegistrationStatus.CANCELLED
    ) {
      throw new ConflictException(ERROR_MESSAGES.EVENT_ALREADY_REGISTERED);
    }

    const registeredCount = await this.registrationsRepository.count({
      where: {
        event_id: eventId,
        status: In([
          EventRegistrationStatus.REGISTERED,
          EventRegistrationStatus.ATTENDED,
        ]),
      },
    });

    const remainingSpots = event.capacity - registeredCount;
    const status =
      remainingSpots <= 0
        ? EventRegistrationStatus.WAITLISTED
        : EventRegistrationStatus.REGISTERED;

    if (existingRegistration) {
      existingRegistration.status = status;
      return this.registrationsRepository.save(existingRegistration);
    }

    const registration = this.registrationsRepository.create({
      event_id: eventId,
      user_id: currentUser.id,
      status,
    });

    return this.registrationsRepository.save(registration);
  }

  async cancelRegistration(eventId: string, currentUser: User) {
    const registration = await this.registrationsRepository.findOne({
      where: { event_id: eventId, user_id: currentUser.id },
    });

    if (!registration) {
      throw new NotFoundException(ERROR_MESSAGES.EVENT_REGISTRATION_NOT_FOUND);
    }

    if (registration.status !== EventRegistrationStatus.CANCELLED) {
      registration.status = EventRegistrationStatus.CANCELLED;
      await this.registrationsRepository.save(registration);

      // After cancellation, try to pop one waitlisted user to registered
      this.popOneWaitlistedToRegistered(eventId);
    }

    return registration;
  }
}
