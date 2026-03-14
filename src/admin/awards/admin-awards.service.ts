import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Award } from 'src/awards/entities/award.entity';
import { CreateAwardDto } from './dto/create-award.dto';
import { UpdateAwardDto } from './dto/update-award.dto';
import { ERROR_MESSAGES } from 'src/constants/swagger-messages';

@Injectable()
export class AdminAwardsService {
  constructor(
    @InjectRepository(Award)
    private readonly awardsRepository: Repository<Award>,
  ) {}

  async create(createAwardDto: CreateAwardDto) {
    const award = this.awardsRepository.create(createAwardDto);
    return await this.awardsRepository.save(award);
  }

  async update(id: string, updateAwardDto: UpdateAwardDto) {
    const award = await this.awardsRepository.findOne({ where: { id } });

    if (!award) {
      throw new NotFoundException(ERROR_MESSAGES.AWARD_NOT_FOUND);
    }

    Object.assign(award, updateAwardDto);
    return await this.awardsRepository.save(award);
  }

  async remove(id: string) {
    const award = await this.awardsRepository.findOne({ where: { id } });

    if (!award) {
      throw new NotFoundException(ERROR_MESSAGES.AWARD_NOT_FOUND);
    }

    await this.awardsRepository.remove(award);
    return { message: 'Award deleted successfully' };
  }
}
