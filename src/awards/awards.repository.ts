import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Award } from './entities/award.entity';
import { ERROR_MESSAGES } from 'src/constants/swagger-messages';

@Injectable()
export class AwardsRepository {
  constructor(
    @InjectRepository(Award)
    private readonly awardRepository: Repository<Award>,
  ) {}

  async findAll(): Promise<Award[]> {
    try {
      return await this.awardRepository.find({
        order: { created_at: 'DESC' },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        ERROR_MESSAGES.FAILED_TO_FETCH_FROM_DB,
      );
    }
  }

  async findById(id: string): Promise<Award> {
    try {
      const award = await this.awardRepository.findOne({
        where: { id },
      });

      if (!award) {
        throw new NotFoundException(ERROR_MESSAGES.AWARD_NOT_FOUND);
      }

      return award;
    } catch (error) {
      throw new InternalServerErrorException(
        ERROR_MESSAGES.FAILED_TO_FETCH_FROM_DB,
      );
    }
  }

  async create(data: Partial<Award>): Promise<Award> {
    try {
      const award = this.awardRepository.create(data);
      return await this.awardRepository.save(award);
    } catch (error) {
      throw new InternalServerErrorException(
        ERROR_MESSAGES.FAILED_TO_SAVE_IN_DB,
      );
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await this.findById(id); // Verify award exists
      await this.awardRepository.delete(id);
    } catch (error) {
      throw new InternalServerErrorException(
        ERROR_MESSAGES.FAILED_TO_DELETE_FROM_DB,
      );
    }
  }
}
