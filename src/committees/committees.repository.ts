import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Committee } from './entities/committee.entity';
import { CommitteesQueryDto } from './dto/committees-query.dto';
import { paginate, PaginatedResult } from 'src/common/utils/pagination.util';

@Injectable()
export class CommitteesRepository {
  constructor(
    @InjectRepository(Committee)
    private readonly committeeRepository: Repository<Committee>,
  ) {}

  async findAllPaginated(
    query: CommitteesQueryDto,
  ): Promise<PaginatedResult<Committee>> {
    const qb = this.committeeRepository
      .createQueryBuilder('committee')
      .leftJoinAndSelect('committee.category', 'category')
      .orderBy('committee.name', 'ASC')
      .addOrderBy('committee.id', 'ASC');

    if (query.category_id) {
      qb.andWhere('committee.category_id = :categoryId', {
        categoryId: query.category_id,
      });
    }

    const search = query.search?.trim();
    if (search) {
      qb.andWhere(
        '(committee.name ILIKE :search OR committee.about ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    return paginate(qb, query);
  }

  async findById(id: string): Promise<Committee | null> {
    return this.committeeRepository.findOne({ where: { id } });
  }

  async findByIdWithMembers(id: string): Promise<Committee | null> {
    return this.committeeRepository.findOne({
      where: { id },
      relations: ['category', 'members'],
      order: {
        members: {
          role: 'ASC',
          name: 'ASC',
        },
      },
    });
  }

  create(data: Partial<Committee>): Committee {
    return this.committeeRepository.create(data);
  }

  async save(committee: Committee): Promise<Committee> {
    return this.committeeRepository.save(committee);
  }

  async remove(committee: Committee): Promise<Committee> {
    return this.committeeRepository.remove(committee);
  }
}
