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

  async findAll() {
    const members = await this.boardRepository.find({
      order: {
        display_order: 'ASC',
        name: 'ASC',
      },
    });

    return {
      members,
      count: members.length,
    };
  }
}
