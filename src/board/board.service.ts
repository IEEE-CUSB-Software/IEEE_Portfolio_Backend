import { Injectable } from '@nestjs/common';
import { paginatedResponse } from 'src/common/utils/pagination.util';
import { BoardRepository } from './board.repository';
import { BoardQueryDto } from './dto/board-query.dto';

@Injectable()
export class BoardService {
  constructor(private readonly boardRepository: BoardRepository) {}

  async findAll(query: BoardQueryDto) {
    return paginatedResponse(
      'members',
      await this.boardRepository.findAllPaginated(query),
    );
  }
}
