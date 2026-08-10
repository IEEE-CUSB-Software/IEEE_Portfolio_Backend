import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BoardMember } from './entities/board-member.entity';
import { BoardQueryDto } from './dto/board-query.dto';
import { paginate, PaginatedResult } from 'src/common/utils/pagination.util';

@Injectable()
export class BoardRepository {
  constructor(
    @InjectRepository(BoardMember)
    private readonly boardRepository: Repository<BoardMember>,
  ) {}

  async findAllPaginated(
    query: BoardQueryDto,
  ): Promise<PaginatedResult<BoardMember>> {
    const qb = this.boardRepository
      .createQueryBuilder('board')
      .orderBy('board.display_order', 'ASC', 'NULLS LAST')
      .addOrderBy('board.name', 'ASC')
      .addOrderBy('board.id', 'ASC');

    const search = query.search?.trim();
    if (search) {
      qb.andWhere('(board.name ILIKE :search)', { search: `%${search}%` });
    }

    const role = query.role?.trim();
    if (role) {
      qb.andWhere('board.role ILIKE :role', { role: `%${role}%` });
    }

    return paginate(qb, query);
  }

  async findById(id: string): Promise<BoardMember | null> {
    return this.boardRepository.findOne({ where: { id } });
  }

  create(data: Partial<BoardMember>): BoardMember {
    return this.boardRepository.create(data);
  }

  async save(member: BoardMember): Promise<BoardMember> {
    return this.boardRepository.save(member);
  }

  async remove(member: BoardMember): Promise<BoardMember> {
    return this.boardRepository.remove(member);
  }
}
