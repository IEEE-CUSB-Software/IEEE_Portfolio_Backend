import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Committee } from 'src/committees/entities/committee.entity';
import { Category } from 'src/categories/entities/category.entity';
import { CreateCommitteeDto } from './dto/create-committee.dto';
import { UpdateCommitteeDto } from './dto/update-committee.dto';
import { ERROR_MESSAGES } from 'src/constants/swagger-messages';

@Injectable()
export class AdminCommitteesService {
  constructor(
    @InjectRepository(Committee)
    private readonly committeeRepository: Repository<Committee>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async create(createCommitteeDto: CreateCommitteeDto) {
    const category = await this.categoryRepository.findOne({
      where: { id: createCommitteeDto.category_id },
    });

    if (!category) {
      throw new BadRequestException(ERROR_MESSAGES.CATEGORY_NOT_FOUND);
    }

    const committee = this.committeeRepository.create(createCommitteeDto);
    return await this.committeeRepository.save(committee);
  }

  async update(id: string, updateCommitteeDto: UpdateCommitteeDto) {
    const committee = await this.committeeRepository.findOne({ where: { id } });

    if (!committee) {
      throw new NotFoundException(ERROR_MESSAGES.COMMITTEE_NOT_FOUND);
    }

    // Validate category exists if category_id is being updated
    if (updateCommitteeDto.category_id) {
      const category = await this.categoryRepository.findOne({
        where: { id: updateCommitteeDto.category_id },
      });

      if (!category) {
        throw new BadRequestException(ERROR_MESSAGES.CATEGORY_NOT_FOUND);
      }
    }

    Object.assign(committee, updateCommitteeDto);
    return await this.committeeRepository.save(committee);
  }

  async remove(id: string) {
    const committee = await this.committeeRepository.findOne({ where: { id } });

    if (!committee) {
      throw new NotFoundException(ERROR_MESSAGES.COMMITTEE_NOT_FOUND);
    }

    // Note: CASCADE DELETE
    await this.committeeRepository.remove(committee);
    return { message: 'Committee and all associated members deleted successfully' };
  }
}
