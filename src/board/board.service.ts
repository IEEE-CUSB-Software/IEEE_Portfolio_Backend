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
    // 1. Get high board members
    const [boardMembers] = await this.boardRepository.findAllPaginated({ limit: 1000, page: 1 });
    
    // 2. Get committee members
    const committeeData = await this.committeeMembersService.findAll({ limit: 1000, page: 1 });
    const allMembers = committeeData[0];
    
    // Filter for leaders (head, vice_head, etc)
    const leaders = allMembers.filter(m => m.role === 'head' || m.role === 'vice_head' || m.role.toLowerCase().includes('head'));

    return {
      board: boardMembers,
      leaders: leaders,
    };
  }
}
