import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Committee } from './entities/committee.entity';
import { ERROR_MESSAGES } from 'src/constants/swagger-messages';

@Injectable()
export class CommitteesService {
  constructor(
    @InjectRepository(Committee)
    private readonly committeeRepository: Repository<Committee>,
  ) {}

  async findAll(categoryId?: string) {
    const queryBuilder = this.committeeRepository
      .createQueryBuilder('committee')
      .leftJoinAndSelect('committee.category', 'category')
      .orderBy('committee.name', 'ASC');

    if (categoryId) {
      queryBuilder.where('committee.category_id = :categoryId', { categoryId });
    }

    const committees = await queryBuilder.getMany();

    return {
      committees,
      count: committees.length,
    };
  }

  async findOne(id: string) {
    const committee = await this.committeeRepository.findOne({
      where: { id },
      relations: ['category', 'members'],
      order: {
        members: {
          role: 'ASC',
          name: 'ASC',
        },
      },
    });

    if (!committee) {
      throw new NotFoundException(ERROR_MESSAGES.COMMITTEE_NOT_FOUND);
    }

    return committee;
  }
}
