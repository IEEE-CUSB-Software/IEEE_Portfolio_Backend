import { Injectable } from '@nestjs/common';
import { AwardsRepository } from '../../awards/awards.repository';
import { CreateAwardDto } from '../../awards/dto';
import { Award } from '../../awards/entities/award.entity';

@Injectable()
export class AdminAwardsService {
  constructor(private readonly awardsRepository: AwardsRepository) {}

  async create(createAwardDto: CreateAwardDto): Promise<Award> {
    return this.awardsRepository.create(createAwardDto);
  }

  async remove(id: string): Promise<void> {
    return this.awardsRepository.delete(id);
  }
}
