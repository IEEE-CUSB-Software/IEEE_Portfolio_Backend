import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Award } from './entities/award.entity';
import { ERROR_MESSAGES } from 'src/constants/swagger-messages';

@Injectable()
export class AwardsService {
  constructor(
    @InjectRepository(Award)
    private readonly awardsRepository: Repository<Award>,
  ) {}

  async findAll() {
    const awards = await this.awardsRepository.find({
      order: {
        title: 'ASC',
      },
    });

    return {
      awards,
      count: awards.length,
    };
  }

  async findOne(id: string) {
    const award = await this.awardsRepository.findOne({ where: { id } });

    if (!award) {
      throw new NotFoundException(ERROR_MESSAGES.AWARD_NOT_FOUND);
    }

    return award;
  }
}
