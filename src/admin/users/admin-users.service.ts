import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ERROR_MESSAGES } from 'src/constants/swagger-messages';
import { MediaService } from 'src/media/media.service';
import { StorageService } from 'src/storage/storage.service';

@Injectable()
export class AdminUsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly mediaService: MediaService,
    private readonly storageService: StorageService,
  ) {}

  async remove(id: string) {
    const user = await this.usersRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException(ERROR_MESSAGES.USER_NOT_FOUND);
    }

    await this.usersRepository.remove(user);

    if (user.image_public_id) {
      await this.mediaService.deleteImage(user.image_public_id);
    }

    return { 
        success: true,
    };
  }

  async downloadUserCV(userId: string) {
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
