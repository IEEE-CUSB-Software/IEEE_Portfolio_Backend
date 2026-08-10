import { Injectable, NotFoundException } from '@nestjs/common';
import { ERROR_MESSAGES } from 'src/constants/swagger-messages';
import { paginatedResponse } from 'src/common/utils/pagination.util';
import { AwardsRepository } from './awards.repository';
import { AwardsQueryDto } from './dto/awards-query.dto';

@Injectable()
export class AwardsService {
  constructor(private readonly awardsRepository: AwardsRepository) {}

  async findAll(query: AwardsQueryDto) {
    return paginatedResponse(
      'awards',
      await this.awardsRepository.findAllPaginated(query),
    );
  }

  async findOne(id: string) {
    const award = await this.awardsRepository.findById(id);

    if (!award) {
      throw new NotFoundException(ERROR_MESSAGES.AWARD_NOT_FOUND);
    }

    return award;
  }
}
