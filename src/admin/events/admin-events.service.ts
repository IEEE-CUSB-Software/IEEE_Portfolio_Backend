import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Event } from 'src/events/entities/event.entity';
import { EventImage } from 'src/events/entities/event-image.entity';
import {
  EventRegistration,
  EventRegistrationStatus,
} from 'src/events/entities/event-registration.entity';
import { User } from 'src/users/entities/user.entity';
import { ERROR_MESSAGES } from 'src/constants/swagger-messages';
import { CreateEventDto } from 'src/admin/events/dto/create-event.dto';
import { UpdateEventDto } from 'src/admin/events/dto/update-event.dto';
import { MediaService } from 'src/media/media.service';
import { resolveMediaFolder } from 'src/media/media.utils';

@Injectable()
export class AdminEventsService {
  constructor(
    @InjectRepository(Event)
    private readonly eventsRepository: Repository<Event>,
    @InjectRepository(EventImage)
    private readonly eventImagesRepository: Repository<EventImage>,
    @InjectRepository(EventRegistration)
    private readonly registrationsRepository: Repository<EventRegistration>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly mediaService: MediaService,
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
      image_url: null,
      image_public_id: null,
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

    Object.assign(event, updateEventDto);

    if (event.start_time && event.end_time && event.registration_deadline) {
      this.validateEventTimes(
        event.start_time,
        event.end_time,
        event.registration_deadline,
      );
    }

    const savedEvent = await this.eventsRepository.save(event);

    return savedEvent;
  }

  // we have image for the event, in that case that is the primary image if the frontend wants to display only one
  // we have also event images for the event, those are the additional images that can be displayed in a gallery or slider on the frontend
  async uploadPrimaryImage(id: string, image: any) {
    const event = await this.eventsRepository.findOne({ where: { id } });

    if (!event) {
      throw new NotFoundException(ERROR_MESSAGES.EVENT_NOT_FOUND);
    }

    if (!image) {
      throw new BadRequestException(ERROR_MESSAGES.IMAGE_IS_REQUIRED);
    }

    const previousPublicId = event.image_public_id;
    const folder = resolveMediaFolder('EVENTS_PRIMARY_IMAGES_FILE_NAME', 'events-primary');
    const uploadedImage = await this.mediaService.uploadImage(image, folder);

    event.image_url = uploadedImage.url;
    event.image_public_id = uploadedImage.public_id;

    const savedEvent = await this.eventsRepository.save(event);

    if (previousPublicId) {
      await this.mediaService.deleteImage(previousPublicId);
    }

    return savedEvent;
  }

  async removePrimaryImage(id: string) {
    const event = await this.eventsRepository.findOne({ where: { id } });

    if (!event) {
      throw new NotFoundException(ERROR_MESSAGES.EVENT_NOT_FOUND);
    }

    if (!event.image_public_id) {
      throw new NotFoundException(ERROR_MESSAGES.IMAGE_NOT_FOUND);
    }

    const publicId = event.image_public_id;
    event.image_url = null;
    event.image_public_id = null;

    await this.eventsRepository.save(event);
    await this.mediaService.deleteImage(publicId);

    return event;
  }

  async remove(id: string) {
    const event = await this.eventsRepository.findOne({
      where: { id },
      relations: ['images'],
    });

    if (!event) {
      throw new NotFoundException(ERROR_MESSAGES.EVENT_NOT_FOUND);
    }

    const publicIdsToDelete = [
      event.image_public_id,
      ...((event.images || [])
        .map((image) => image.image_public_id)
        .filter(Boolean)),
    ].filter(Boolean) as string[];

    await this.eventsRepository.remove(event);

    await Promise.all(
      publicIdsToDelete.map((publicId) => this.mediaService.deleteImage(publicId)),
    );

    return {
        success: true,
    };
  }

  // for event images
  async addImages(eventId: string, files: any[]) {
    const event = await this.eventsRepository.findOne({
      where: { id: eventId },
    });

    if (!event) {
      throw new NotFoundException(ERROR_MESSAGES.EVENT_NOT_FOUND);
    }

    if (!files.length) {
      throw new BadRequestException(ERROR_MESSAGES.AT_LEAST_ONE_IMAGE_IS_REQUIRED);
    }

    const existingCount = await this.eventImagesRepository.count({
      where: { event_id: eventId },
    });
    const folder = resolveMediaFolder('EVENTS_IMAGES_FILE_NAME', 'events');

    const uploadedImages = await Promise.all(
      files.map((file) => this.mediaService.uploadImage(file, folder)),
    );

    const images = uploadedImages.map((uploadedImage, index) =>
      this.eventImagesRepository.create({
        event_id: eventId,
        image_url: uploadedImage.url,
        image_public_id: uploadedImage.public_id,
        sort_order: existingCount + index,
      }),
    );

    return this.eventImagesRepository.save(images);
  }

  async removeImage(eventId: string, imageId: string) {
    const image = await this.eventImagesRepository.findOne({
      where: { id: imageId, event_id: eventId },
    });

    if (!image) {
      throw new NotFoundException(ERROR_MESSAGES.IMAGE_NOT_FOUND);
    }

    if (image.image_public_id) {
      await this.mediaService.deleteImage(image.image_public_id);
    }

    await this.eventImagesRepository.remove(image);

    return { success: true };
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

    const newRegistrations: EventRegistration[] = [];
    const updatedRegistrations: EventRegistration[] = [];

    for (const userId of userIds) {
      const existingReg = existingRegistrations.find(
        (reg) => reg.user_id === userId,
      );

      if (existingReg) {
        if (existingReg.status === EventRegistrationStatus.CANCELLED || 
          existingReg.status === EventRegistrationStatus.WAITLISTED
        ) {
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

    const saved = await this.registrationsRepository.save([
      ...newRegistrations,
      ...updatedRegistrations,
    ]);

    return saved;
  }
}
