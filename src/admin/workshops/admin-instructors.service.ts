import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Instructor } from 'src/workshops/entities/instructor.entity';
import { ERROR_MESSAGES } from 'src/constants/swagger-messages';
import { CreateInstructorDto } from './dto/create-instructor.dto';
import { UpdateInstructorDto } from './dto/update-instructor.dto';
import { MediaService } from 'src/media/media.service';
import { resolveMediaFolder } from 'src/media/media.utils';

const INSTRUCTORS_MEDIA_FOLDER = resolveMediaFolder('INSTRUCTORS_IMAGES_FILE_NAME', 'instructors');

@Injectable()
export class AdminInstructorsService {
  constructor(
    @InjectRepository(Instructor)
    private readonly instructorsRepository: Repository<Instructor>,
    private readonly mediaService: MediaService,
  ) {}

  async create(createInstructorDto: CreateInstructorDto) {
    const instructor = this.instructorsRepository.create({
      ...createInstructorDto,
      image_url: null,
      image_public_id: null,
    });
    return this.instructorsRepository.save(instructor);
  }

  async update(id: string, updateInstructorDto: UpdateInstructorDto) {
    const instructor = await this.instructorsRepository.preload({
      id,
      ...updateInstructorDto,
    });

    if (!instructor) {
      throw new NotFoundException(ERROR_MESSAGES.INSTRUCTOR_NOT_FOUND);
    }

    return this.instructorsRepository.save(instructor);
  }

  async uploadImage(id: string, image: any) {
    const instructor = await this.instructorsRepository.findOne({ where: { id } });

    if (!instructor) {
      throw new NotFoundException(ERROR_MESSAGES.INSTRUCTOR_NOT_FOUND);
    }

    if (!image) {
      throw new BadRequestException(ERROR_MESSAGES.IMAGE_IS_REQUIRED);
    }

    const previousPublicId = instructor.image_public_id;
    const uploadedImage = await this.mediaService.uploadImage(image, INSTRUCTORS_MEDIA_FOLDER);

    instructor.image_url = uploadedImage.url;
    instructor.image_public_id = uploadedImage.public_id;

    const savedInstructor = await this.instructorsRepository.save(instructor);

    if (previousPublicId) {
      await this.mediaService.deleteImage(previousPublicId);
    }

    return savedInstructor;
  }

  async removeImage(id: string) {
    const instructor = await this.instructorsRepository.findOne({ where: { id } });

    if (!instructor) {
      throw new NotFoundException(ERROR_MESSAGES.INSTRUCTOR_NOT_FOUND);
    }

    if (!instructor.image_public_id) {
      throw new NotFoundException(ERROR_MESSAGES.IMAGE_NOT_FOUND);
    }

    const publicId = instructor.image_public_id;
    instructor.image_url = null;
    instructor.image_public_id = null;

    await this.instructorsRepository.save(instructor);
    await this.mediaService.deleteImage(publicId);

    return instructor;
  }

  async remove(id: string) {
    const instructor = await this.instructorsRepository.findOne({ where: { id } });

    if (!instructor) {
      throw new NotFoundException(ERROR_MESSAGES.INSTRUCTOR_NOT_FOUND);
    }

    await this.instructorsRepository.remove(instructor);

    if (instructor.image_public_id) {
      await this.mediaService.deleteImage(instructor.image_public_id);
    }

    return { success: true };
  }
}
