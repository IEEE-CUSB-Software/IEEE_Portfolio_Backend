import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Role, RoleName } from './entities/role.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ERROR_MESSAGES } from 'src/constants/swagger-messages';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private readonly rolesRepository: Repository<Role>,
  ) {}



  async findAll(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    const [roles, total] = await this.rolesRepository.findAndCount({
      skip,
      take: limit,
      order: { created_at: 'DESC' },
    });

    return {
      data: roles,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string) {
    const role = await this.rolesRepository.findOne({
      where: { id },
    });

    if (!role) {
      throw new NotFoundException(ERROR_MESSAGES.ROLE_NOT_FOUND);
    }

    return role;
  }

  async findByName(name: RoleName) {
    const role = await this.rolesRepository.findOne({ where: { name } });

    if (!role) {
      throw new NotFoundException(ERROR_MESSAGES.ROLE_NOT_FOUND);
    }
    return role;
  }
}
