import { Injectable, NotFoundException } from '@nestjs/common';
import { ERROR_MESSAGES } from 'src/constants/swagger-messages';
import { paginatedResponse } from 'src/common/utils/pagination.util';
import { CommitteesRepository } from './committees.repository';
import { CommitteesQueryDto } from './dto/committees-query.dto';

@Injectable()
export class CommitteesService {
  constructor(private readonly committeesRepository: CommitteesRepository) {}

  async findAll(query: CommitteesQueryDto) {
    return paginatedResponse(
      'committees',
      await this.committeesRepository.findAllPaginated(query),
    );
  }

  async findOne(id: string) {
    const committee = await this.committeesRepository.findByIdWithMembers(id);

    if (!committee) {
      throw new NotFoundException(ERROR_MESSAGES.COMMITTEE_NOT_FOUND);
    }

    return committee;
  }
}
