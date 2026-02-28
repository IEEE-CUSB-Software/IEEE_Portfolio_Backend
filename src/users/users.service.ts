import {
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
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly rolesService: RolesService,
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
}
