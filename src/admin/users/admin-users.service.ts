import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository, Brackets } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ERROR_MESSAGES } from 'src/constants/swagger-messages';
import { MediaService } from 'src/media/media.service';
import { StorageService } from 'src/storage/storage.service';
import { RolesService } from 'src/roles/roles.service';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AdminUsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly mediaService: MediaService,
    private readonly storageService: StorageService,
    private readonly rolesService: RolesService,
    private readonly usersService: UsersService,
  ) {}

  async findAll(
    page: number,
    limit: number,
    search?: string,
    email?: string,
    username?: string,
    roleId?: string,
    university?: string,
  ) {
    const qb = this.usersRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.role', 'role')
      .orderBy('user.created_at', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    if (search) {
      qb.andWhere(
        new Brackets((qb) => {
          qb.where('user.name ILIKE :search', { search: `%${search}%` })
            .orWhere('user.email ILIKE :search', { search: `%${search}%` })
            .orWhere('user.username ILIKE :search', { search: `%${search}%` });
        }),
      );
    }

    if (email) {
      qb.andWhere('user.email ILIKE :email', { email: `%${email}%` });
    }

    if (username) {
      qb.andWhere('user.username ILIKE :username', {
        username: `%${username}%`,
      });
    }

    if (roleId) {
      qb.andWhere('user.role_id = :roleId', { roleId });
    }

    if (university) {
      qb.andWhere('user.university = :university', { university });
    }

    const [users, total] = await qb.getManyAndCount();

    return {
      data: users,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: ['role'],
    });

    if (!user) {
      throw new NotFoundException(ERROR_MESSAGES.USER_NOT_FOUND);
    }

    return user;
  }

  async remove(id: string) {
    const user = await this.usersRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException(ERROR_MESSAGES.USER_NOT_FOUND);
    }

    await this.usersRepository.remove(user);

    if (user.image_public_id) {
      await this.mediaService.deleteImage(user.image_public_id);
    }
    if (user.cv_file_key) {
      await this.storageService.deleteFile(user.cv_file_key);
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

  async getApplications(userId: string) {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException(ERROR_MESSAGES.USER_NOT_FOUND);
    }

    return this.usersService.getApplications(userId);
  }

  async updateRole(id: string, updateUserRoleDto: UpdateUserRoleDto) {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: ['role'],
    });

    if (!user) {
      throw new NotFoundException(ERROR_MESSAGES.USER_NOT_FOUND);
    }

    const role = await this.rolesService.findOne(updateUserRoleDto.roleId);

    user.role = role;
    user.role_id = role.id;

    return await this.usersRepository.save(user);
  }
}
