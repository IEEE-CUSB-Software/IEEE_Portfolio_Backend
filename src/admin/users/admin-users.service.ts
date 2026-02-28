import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ERROR_MESSAGES } from 'src/constants/swagger-messages';

@Injectable()
export class AdminUsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async remove(id: string) {
    const result = await this.usersRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(ERROR_MESSAGES.USER_NOT_FOUND);
    }

    return { 
        success: true,
    };
  }
}
