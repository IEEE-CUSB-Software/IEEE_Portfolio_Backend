import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { RolesService } from 'src/roles/roles.service';
import { ERROR_MESSAGES } from 'src/constants/swagger-messages';
import { MediaService } from 'src/media/media.service';
import { resolveMediaFolder } from 'src/media/media.utils';
import { StorageService } from 'src/storage/storage.service';

const USERS_MEDIA_FOLDER = resolveMediaFolder('USERS_IMAGES_FILE_NAME', 'users');

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly rolesService: RolesService,
    private readonly mediaService: MediaService,
    private readonly storageService: StorageService,
  ) {}

  async findOne(id: string, currentUser: User) {
    if (currentUser.id !== id) {
      throw new ForbiddenException(ERROR_MESSAGES.FORBIDDEN_ACTION);
    }
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: ['role'],
    });

    if (!user) {
      throw new NotFoundException(ERROR_MESSAGES.USER_NOT_FOUND);
    }
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto, currentUser: User) {
    if (currentUser.id !== id) {
      throw new ForbiddenException(ERROR_MESSAGES.FORBIDDEN_ACTION);
    }
    const user = await this.usersRepository.preload({
      ...updateUserDto,
      id: id,
    });

    if (!user) {
      throw new NotFoundException(ERROR_MESSAGES.USER_NOT_FOUND);
    }

    return this.usersRepository.save(user);
  }

  async uploadImage(id: string, image: any, currentUser: User) {
    if (currentUser.id !== id) {
      throw new ForbiddenException(ERROR_MESSAGES.FORBIDDEN_ACTION);
    }

    const user = await this.usersRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException(ERROR_MESSAGES.USER_NOT_FOUND);
    }

    if (!image) {
      throw new BadRequestException(ERROR_MESSAGES.IMAGE_IS_REQUIRED);
    }

    const previousPublicId = user.image_public_id;
    const uploadedImage = await this.mediaService.uploadImage(image, USERS_MEDIA_FOLDER);

    user.image_url = uploadedImage.url;
    user.image_public_id = uploadedImage.public_id;

    const savedUser = await this.usersRepository.save(user);

    if (previousPublicId) {
      await this.mediaService.deleteImage(previousPublicId);
    }

    return savedUser;
  }

  async removeImage(id: string, currentUser: User) {
    if (currentUser.id !== id) {
      throw new ForbiddenException(ERROR_MESSAGES.FORBIDDEN_ACTION);
    }

    const user = await this.usersRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException(ERROR_MESSAGES.USER_NOT_FOUND);
    }

    if (!user.image_public_id) {
      throw new NotFoundException(ERROR_MESSAGES.IMAGE_NOT_FOUND);
    }

    const publicId = user.image_public_id;
    user.image_url = null;
    user.image_public_id = null;

    await this.usersRepository.save(user);
    await this.mediaService.deleteImage(publicId);

    return user;
  }

  async uploadCV(id: string, cvFile: Express.Multer.File, currentUser: User) {
    if (currentUser.id !== id) {
      throw new ForbiddenException(ERROR_MESSAGES.FORBIDDEN_ACTION);
    }

    const user = await this.usersRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException(ERROR_MESSAGES.USER_NOT_FOUND);
    }

    if (!cvFile) {
      throw new BadRequestException('CV file is required');
    }

    if (cvFile.mimetype !== 'application/pdf') {
      throw new BadRequestException('Only PDF files are allowed');
    }

    // Delete previous CV if it exists
    if (user.cv_file_key) {
      await this.storageService.deleteFile(user.cv_file_key);
    }

    // Upload new CV to R2
    const uploadResponse = await this.storageService.uploadFile({
      fileName: cvFile.originalname,
      fileBuffer: cvFile.buffer,
      contentType: 'application/pdf',
      prefix: 'CV/',
      metadata: {
        userId: id,
        uploadType: 'cv',
        uploadedAt: new Date().toISOString(),
      },
    });

    // Save file key to user
    user.cv_file_key = uploadResponse.fileKey;
    await this.usersRepository.save(user);

    return {
      message: 'CV uploaded successfully',
      fileKey: uploadResponse.fileKey,
      fileUrl: uploadResponse.fileUrl,
      fileName: cvFile.originalname,
    };
  }

  async downloadCV(id: string, currentUser: User) {
    if (currentUser.id !== id) {
      throw new ForbiddenException(ERROR_MESSAGES.FORBIDDEN_ACTION);
    }

    const user = await this.usersRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException(ERROR_MESSAGES.USER_NOT_FOUND);
    }

    if (!user.cv_file_key) {
      throw new NotFoundException('CV not found for this user');
    }

    const file = await this.storageService.getFile(user.cv_file_key);

    return {
      fileBuffer: file.fileBuffer,
      contentType: file.contentType,
      fileName: user.name.replace(/\s+/g, '_') + '.pdf',
    };
  }

  async getAdminDownloadCV(userId: string) {
    const user = await this.usersRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException(ERROR_MESSAGES.USER_NOT_FOUND);
    }

    if (!user.cv_file_key) {
      throw new NotFoundException('CV not found for this user');
    }

    const file = await this.storageService.getFile(user.cv_file_key);

    return {
      fileBuffer: file.fileBuffer,
      contentType: file.contentType,
      fileName: user.name.replace(/\s+/g, '_') + '.pdf',
      userName: user.name,
      userEmail: user.email,
    };
  }
}
