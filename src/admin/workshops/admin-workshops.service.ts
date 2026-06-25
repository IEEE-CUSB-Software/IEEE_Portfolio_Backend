import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Workshop } from 'src/workshops/entities/workshop.entity';
import { Instructor } from 'src/workshops/entities/instructor.entity';
import { WorkshopImage } from 'src/workshops/entities/workshop-image.entity';
import { WorkshopRegistration, WorkshopRegistrationStatus } from 'src/workshops/entities/workshop-registration.entity';
import { User } from 'src/users/entities/user.entity';
import { ERROR_MESSAGES } from 'src/constants/swagger-messages';
import { CreateWorkshopDto } from './dto/create-workshop.dto';
import { UpdateWorkshopDto } from './dto/update-workshop.dto';
import { MediaService } from 'src/media/media.service';
import { resolveMediaFolder } from 'src/media/media.utils';

const WORKSHOPS_PRIMARY_MEDIA_FOLDER = resolveMediaFolder('WORKSHOPS_PRIMARY_IMAGES_FILE_NAME', 'workshops-primary');
const WORKSHOPS_GALLERY_MEDIA_FOLDER = resolveMediaFolder('WORKSHOPS_IMAGES_FILE_NAME', 'workshops');

@Injectable()
export class AdminWorkshopsService {
  constructor(
    @InjectRepository(Workshop)
    private readonly workshopsRepository: Repository<Workshop>,
    @InjectRepository(Instructor)
    private readonly instructorsRepository: Repository<Instructor>,
    @InjectRepository(WorkshopImage)
    private readonly workshopImagesRepository: Repository<WorkshopImage>,
    @InjectRepository(WorkshopRegistration)
    private readonly registrationsRepository: Repository<WorkshopRegistration>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly mediaService: MediaService,
  ) {}

  private getMissingIds(requestedIds: string[], foundIds: string[]) {
    const foundIdSet = new Set(foundIds);
    return requestedIds.filter((id) => !foundIdSet.has(id));
  }

  private validateWorkshopTimes(
    start_time: Date,
    end_time: Date,
    registration_deadline: Date,
  ) {
    if (end_time < new Date()) {
      throw new BadRequestException(ERROR_MESSAGES.WORKSHOP_END_TIME_IN_PAST);
    }

    if (start_time >= end_time) {
      throw new BadRequestException(ERROR_MESSAGES.WORKSHOP_INVALID_TIME_RANGE);
    }

    if (registration_deadline > start_time) {
      throw new BadRequestException(ERROR_MESSAGES.WORKSHOP_INVALID_TIME_RANGE);
    }
  }

  async create(createWorkshopDto: CreateWorkshopDto, currentUser: User) {
    const start_time = new Date(createWorkshopDto.start_time);
    const end_time = new Date(createWorkshopDto.end_time);
    const registration_deadline = new Date(createWorkshopDto.registration_deadline);

    this.validateWorkshopTimes(start_time, end_time, registration_deadline);

    let instructors: Instructor[] = [];
    if (createWorkshopDto.instructor_ids && createWorkshopDto.instructor_ids.length > 0) {
      instructors = await this.instructorsRepository.find({
        where: { id: In(createWorkshopDto.instructor_ids) },
      });
      const missingInstructorIds = this.getMissingIds(
        createWorkshopDto.instructor_ids,
        instructors.map((instructor) => instructor.id),
      );

      if (missingInstructorIds.length > 0) {
        throw new BadRequestException(
          `Instructor(s) not found: ${missingInstructorIds.join(', ')}`,
        );
      }
    }

    const { instructor_ids, ...rest } = createWorkshopDto;
    const workshop = this.workshopsRepository.create({
      ...rest,
      instructors,
      image_url: null,
      image_public_id: null,
      start_time,
      end_time,
      registration_deadline,
      created_by: currentUser.id,
    });

    return this.workshopsRepository.save(workshop);
  }

  async update(id: string, updateWorkshopDto: UpdateWorkshopDto) {
    const workshop = await this.workshopsRepository.findOne({
      where: { id },
      relations: ['instructors'],
    });

    if (!workshop) {
      throw new NotFoundException(ERROR_MESSAGES.WORKSHOP_NOT_FOUND);
    }

    if (updateWorkshopDto.instructor_ids) {
      const instructors = await this.instructorsRepository.find({
        where: { id: In(updateWorkshopDto.instructor_ids) },
      });
      const missingInstructorIds = this.getMissingIds(
        updateWorkshopDto.instructor_ids,
        instructors.map((instructor) => instructor.id),
      );

      if (missingInstructorIds.length > 0) {
        throw new BadRequestException(
          `Instructor(s) not found: ${missingInstructorIds.join(', ')}`,
        );
      }
      workshop.instructors = instructors;
    }

    const { instructor_ids, ...rest } = updateWorkshopDto;
    Object.assign(workshop, rest);

    if (updateWorkshopDto.start_time) workshop.start_time = new Date(updateWorkshopDto.start_time);
    if (updateWorkshopDto.end_time) workshop.end_time = new Date(updateWorkshopDto.end_time);
    if (updateWorkshopDto.registration_deadline) {
      workshop.registration_deadline = new Date(updateWorkshopDto.registration_deadline);
    }

    this.validateWorkshopTimes(
      workshop.start_time,
      workshop.end_time,
      workshop.registration_deadline,
    );

    return this.workshopsRepository.save(workshop);
  }

  async uploadPrimaryImage(id: string, image: any) {
    const workshop = await this.workshopsRepository.findOne({ where: { id } });

    if (!workshop) {
      throw new NotFoundException(ERROR_MESSAGES.WORKSHOP_NOT_FOUND);
    }

    if (!image) {
      throw new BadRequestException(ERROR_MESSAGES.IMAGE_IS_REQUIRED);
    }

    const previousPublicId = workshop.image_public_id;
    const uploadedImage = await this.mediaService.uploadImage(image, WORKSHOPS_PRIMARY_MEDIA_FOLDER);

    workshop.image_url = uploadedImage.url;
    workshop.image_public_id = uploadedImage.public_id;

    const savedWorkshop = await this.workshopsRepository.save(workshop);

    if (previousPublicId) {
      await this.mediaService.deleteImage(previousPublicId);
    }

    return savedWorkshop;
  }

  async removePrimaryImage(id: string) {
    const workshop = await this.workshopsRepository.findOne({ where: { id } });

    if (!workshop) {
      throw new NotFoundException(ERROR_MESSAGES.WORKSHOP_NOT_FOUND);
    }

    if (!workshop.image_public_id) {
      throw new NotFoundException(ERROR_MESSAGES.IMAGE_NOT_FOUND);
    }

    const publicId = workshop.image_public_id;
    workshop.image_url = null;
    workshop.image_public_id = null;

    await this.workshopsRepository.save(workshop);
    await this.mediaService.deleteImage(publicId);

    return workshop;
  }

  async remove(id: string) {
    const workshop = await this.workshopsRepository.findOne({
      where: { id },
      relations: ['images'],
    });

    if (!workshop) {
      throw new NotFoundException(ERROR_MESSAGES.WORKSHOP_NOT_FOUND);
    }

    const publicIdsToDelete = [
      workshop.image_public_id,
      ...((workshop.images || [])
        .map((image) => image.image_public_id)
        .filter(Boolean)),
    ].filter(Boolean) as string[];

    await this.workshopsRepository.remove(workshop);

    await Promise.all(
      publicIdsToDelete.map((publicId) => this.mediaService.deleteImage(publicId)),
    );

    return { success: true };
  }

  async addImages(workshopId: string, files: any[]) {
    const workshop = await this.workshopsRepository.findOne({ where: { id: workshopId } });

    if (!workshop) {
      throw new NotFoundException(ERROR_MESSAGES.WORKSHOP_NOT_FOUND);
    }

    if (!files || !files.length) {
      throw new BadRequestException(ERROR_MESSAGES.AT_LEAST_ONE_IMAGE_IS_REQUIRED);
    }

    const existingCount = await this.workshopImagesRepository.count({
      where: { workshop_id: workshopId },
    });

    const uploadedImages = await Promise.all(
      files.map((file) => this.mediaService.uploadImage(file, WORKSHOPS_GALLERY_MEDIA_FOLDER)),
    );

    const images = uploadedImages.map((uploadedImage, index) =>
      this.workshopImagesRepository.create({
        workshop_id: workshopId,
        image_url: uploadedImage.url,
        image_public_id: uploadedImage.public_id,
        sort_order: existingCount + index,
      }),
    );

    return this.workshopImagesRepository.save(images);
  }

  async removeImage(workshopId: string, imageId: string) {
    const image = await this.workshopImagesRepository.findOne({
      where: { id: imageId, workshop_id: workshopId },
    });

    if (!image) {
      throw new NotFoundException(ERROR_MESSAGES.IMAGE_NOT_FOUND);
    }

    if (image.image_public_id) {
      await this.mediaService.deleteImage(image.image_public_id);
    }

    await this.workshopImagesRepository.remove(image);

    return { success: true };
  }

  async getWorkshopRegistrations(
    workshopId: string,
    page: number = 1,
    limit: number = 10,
  ) {
    const workshop = await this.workshopsRepository.findOne({
      where: { id: workshopId },
    });

    if (!workshop) {
      throw new NotFoundException(ERROR_MESSAGES.WORKSHOP_NOT_FOUND);
    }

    const skip = (page - 1) * limit;

    const [registrations, total] = await this.registrationsRepository.findAndCount({
      where: { workshop_id: workshopId },
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
    workshopId: string,
    registrationId: string,
    status: WorkshopRegistrationStatus,
  ) {
    const workshop = await this.workshopsRepository.findOne({
      where: { id: workshopId },
    });

    if (!workshop) {
      throw new NotFoundException(ERROR_MESSAGES.WORKSHOP_NOT_FOUND);
    }

    const registration = await this.registrationsRepository.findOne({
      where: { id: registrationId, workshop_id: workshopId },
    });

    if (!registration) {
      throw new NotFoundException(ERROR_MESSAGES.WORKSHOP_REGISTRATION_NOT_FOUND);
    }

    // Capacity validation if updating status to ACCEPTED
    if (
      status === WorkshopRegistrationStatus.ACCEPTED &&
      registration.status !== WorkshopRegistrationStatus.ACCEPTED
    ) {
      const acceptedCount = await this.registrationsRepository.count({
        where: {
          workshop_id: workshopId,
          status: In([
            WorkshopRegistrationStatus.ACCEPTED,
            WorkshopRegistrationStatus.ATTENDED,
          ]),
        },
      });

      if (acceptedCount >= workshop.capacity) {
        throw new BadRequestException(ERROR_MESSAGES.WORKSHOP_FULL);
      }
    }

    registration.status = status;
    return this.registrationsRepository.save(registration);
  }

  async bulkRegisterUsers(
    workshopId: string,
    userIds: string[],
  ): Promise<WorkshopRegistration[]> {
    const workshop = await this.workshopsRepository.findOne({
      where: { id: workshopId },
    });

    if (!workshop) {
      throw new NotFoundException(ERROR_MESSAGES.WORKSHOP_NOT_FOUND);
    }

    const users = await this.usersRepository.find({
      where: { id: In(userIds) },
    });
    const missingUserIds = this.getMissingIds(
      userIds,
      users.map((user) => user.id),
    );

    if (missingUserIds.length > 0) {
      throw new BadRequestException(
        `User(s) not found: ${missingUserIds.join(', ')}`,
      );
    }

    const existingRegistrations = await this.registrationsRepository.find({
      where: {
        workshop_id: workshopId,
        user_id: In(userIds),
      },
    });

    const newRegistrations: WorkshopRegistration[] = [];
    const updatedRegistrations: WorkshopRegistration[] = [];

    for (const userId of userIds) {
      const existingReg = existingRegistrations.find(
        (reg) => reg.user_id === userId,
      );

      if (existingReg) {
        if (existingReg.status !== WorkshopRegistrationStatus.ACCEPTED &&
            existingReg.status !== WorkshopRegistrationStatus.ATTENDED) {
          existingReg.status = WorkshopRegistrationStatus.ACCEPTED;
          updatedRegistrations.push(existingReg);
        }
      } else {
        const registration = this.registrationsRepository.create({
          workshop_id: workshopId,
          user_id: userId,
          status: WorkshopRegistrationStatus.ACCEPTED,
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
