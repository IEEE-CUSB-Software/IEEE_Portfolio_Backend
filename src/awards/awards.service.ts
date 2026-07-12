import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Award } from './entities/award.entity';
import { ERROR_MESSAGES } from 'src/constants/swagger-messages';
import { AwardSource } from './enums/award-source.enum';

@Injectable()
export class AwardsService {
  constructor(
    @InjectRepository(Award)
    private readonly awardsRepository: Repository<Award>,
  ) {}

  async findAll(search?: string, year?: number, source?: AwardSource) {
    const qb = this.awardsRepository
      .createQueryBuilder('award')
      .orderBy('award.title', 'ASC');

    if (search) {
      qb.andWhere(
        '(award.title ILIKE :search OR award.description ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    if (year) {
      qb.andWhere('award.year = :year', { year });
    }

    if (source) {
      qb.andWhere('award.source = :source', { source });
    }

    const awards = await qb.getMany();

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
