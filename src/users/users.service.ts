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

const USERS_MEDIA_FOLDER = resolveMediaFolder('USERS_IMAGES_FILE_NAME', 'users');

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly rolesService: RolesService,
    private readonly mediaService: MediaService,
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

  async uploadAvatar(id: string, image: any, currentUser: User) {
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

    const previousPublicId = user.avatar_public_id;
    const uploadedImage = await this.mediaService.uploadImage(image, USERS_MEDIA_FOLDER);

    user.avatar_url = uploadedImage.url;
    user.avatar_public_id = uploadedImage.public_id;

    const savedUser = await this.usersRepository.save(user);

    if (previousPublicId) {
      await this.mediaService.deleteImage(previousPublicId);
    }

    return savedUser;
  }

  async removeAvatar(id: string, currentUser: User) {
    if (currentUser.id !== id) {
      throw new ForbiddenException(ERROR_MESSAGES.FORBIDDEN_ACTION);
    }

    const user = await this.usersRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException(ERROR_MESSAGES.USER_NOT_FOUND);
    }

    if (!user.avatar_public_id) {
      throw new NotFoundException(ERROR_MESSAGES.IMAGE_NOT_FOUND);
    }

    const publicId = user.avatar_public_id;
    user.avatar_url = null;
    user.avatar_public_id = null;

    await this.usersRepository.save(user);
    await this.mediaService.deleteImage(publicId);

    return user;
  }
}
