import { Injectable } from '@nestjs/common';
import { AwardsRepository } from './awards.repository';
import { Award } from './entities/award.entity';

@Injectable()
export class AwardsService {
  constructor(private readonly awardsRepository: AwardsRepository) {}

  async findAll(): Promise<Award[]> {
    return this.awardsRepository.findAll();
  }
}
