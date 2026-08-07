import { Injectable } from '@nestjs/common';
import { paginatedResponse } from 'src/common/utils/pagination.util';
import { BoardRepository } from './board.repository';
import { BoardQueryDto } from './dto/board-query.dto';
import { CommitteeMembersService } from '../committees/committee-members.service';

@Injectable()
export class BoardService {
  constructor(
    private readonly boardRepository: BoardRepository,
    private readonly committeeMembersService: CommitteeMembersService,
  ) {}

  async findAll(query: BoardQueryDto) {
    return paginatedResponse(
      'members',
      await this.boardRepository.findAllPaginated(query),
    );
  }

  async getOfficers() {
    const { items: board } = await this.boardRepository.findAllPaginated({
      limit: 1000,
      page: 1,
    });
    const leaders = await this.committeeMembersService.findLeaders();

    return {
      board,
      leaders,
    };
  }
}
