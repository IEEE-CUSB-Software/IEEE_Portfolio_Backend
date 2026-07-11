import {
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BoardMember } from './entities/board-member.entity';

@Injectable()
export class BoardService {
  constructor(
    @InjectRepository(BoardMember)
    private readonly boardRepository: Repository<BoardMember>,
  ) {}

  async findAll(search?: string, role?: string) {
    const qb = this.boardRepository
      .createQueryBuilder('board')
      .orderBy('board.display_order', 'ASC')
      .addOrderBy('board.name', 'ASC');

    if (search) {
      qb.andWhere(
        '(board.name ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    if (role) {
      qb.andWhere('board.role ILIKE :role', { role: `%${role}%` });
    }

    const members = await qb.getMany();

    return {
      members,
      count: members.length,
    };
  }
}
