import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Award } from './entities/award.entity';
import { AwardsQueryDto } from './dto/awards-query.dto';
import { paginate, PaginatedResult } from 'src/common/utils/pagination.util';

@Injectable()
export class AwardsRepository {
  constructor(
    @InjectRepository(Award)
    private readonly awardsRepository: Repository<Award>,
  ) {}

  async findAllPaginated(
    query: AwardsQueryDto,
  ): Promise<PaginatedResult<Award>> {
    const qb = this.awardsRepository
      .createQueryBuilder('award')
      .orderBy('award.title', 'ASC')
      .addOrderBy('award.id', 'ASC');

    const search = query.search?.trim();
    if (search) {
      qb.andWhere(
        '(award.title ILIKE :search OR award.description ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    if (query.year !== undefined) {
      qb.andWhere('award.year = :year', { year: query.year });
    }

    if (query.source) {
      qb.andWhere('award.source = :source', { source: query.source });
    }

    return paginate(qb, query);
  }

  async findById(id: string): Promise<Award | null> {
    return this.awardsRepository.findOne({ where: { id } });
  }

  create(data: Partial<Award>): Award {
    return this.awardsRepository.create(data);
  }

  async save(award: Award): Promise<Award> {
    return this.awardsRepository.save(award);
  }

  async remove(award: Award): Promise<Award> {
    return this.awardsRepository.remove(award);
  }
}
