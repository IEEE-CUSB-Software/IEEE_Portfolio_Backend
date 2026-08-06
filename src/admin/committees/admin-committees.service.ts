import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CommitteesRepository } from 'src/committees/committees.repository';
import { CategoriesRepository } from 'src/categories/categories.repository';
import { CreateCommitteeDto } from './dto/create-committee.dto';
import { UpdateCommitteeDto } from './dto/update-committee.dto';
import { ERROR_MESSAGES } from 'src/constants/swagger-messages';

@Injectable()
export class AdminCommitteesService {
  constructor(
    private readonly committeesRepository: CommitteesRepository,
    private readonly categoriesRepository: CategoriesRepository,
  ) {}

  async create(createCommitteeDto: CreateCommitteeDto) {
    await this.assertCategoryExists(createCommitteeDto.category_id);

    const committee = this.committeesRepository.create(createCommitteeDto);
    return await this.committeesRepository.save(committee);
  }

  async update(id: string, updateCommitteeDto: UpdateCommitteeDto) {
    const committee = await this.committeesRepository.findById(id);

    if (!committee) {
      throw new NotFoundException(ERROR_MESSAGES.COMMITTEE_NOT_FOUND);
    }

    // Validate category exists if category_id is being updated
    if (updateCommitteeDto.category_id) {
      await this.assertCategoryExists(updateCommitteeDto.category_id);
    }

    Object.assign(committee, updateCommitteeDto);
    return await this.committeesRepository.save(committee);
  }

  async remove(id: string) {
    const committee = await this.committeesRepository.findById(id);

    if (!committee) {
      throw new NotFoundException(ERROR_MESSAGES.COMMITTEE_NOT_FOUND);
    }

    // Note: CASCADE DELETE
    await this.committeesRepository.remove(committee);
    return {
      message: 'Committee and all associated members deleted successfully',
    };
  }

  private async assertCategoryExists(categoryId: string) {
    const category = await this.categoriesRepository.findById(categoryId);

    if (!category) {
      throw new BadRequestException(ERROR_MESSAGES.CATEGORY_NOT_FOUND);
    }
  }
}
