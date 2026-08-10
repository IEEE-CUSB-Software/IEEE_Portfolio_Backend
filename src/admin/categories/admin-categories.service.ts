import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CategoriesRepository } from 'src/categories/categories.repository';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ERROR_MESSAGES } from 'src/constants/swagger-messages';

@Injectable()
export class AdminCategoriesService {
  constructor(private readonly categoriesRepository: CategoriesRepository) {}

  async create(createCategoryDto: CreateCategoryDto) {
    // Check for duplicate name
    await this.assertNameIsFree(createCategoryDto.name);

    const category = this.categoriesRepository.create(createCategoryDto);
    return await this.categoriesRepository.save(category);
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.categoriesRepository.findById(id);

    if (!category) {
      throw new NotFoundException(ERROR_MESSAGES.CATEGORY_NOT_FOUND);
    }

    // Check for duplicate name if name is being updated
    if (updateCategoryDto.name && updateCategoryDto.name !== category.name) {
      await this.assertNameIsFree(updateCategoryDto.name);
    }

    Object.assign(category, updateCategoryDto);
    return await this.categoriesRepository.save(category);
  }

  async remove(id: string) {
    const category = await this.categoriesRepository.findById(id);

    if (!category) {
      throw new NotFoundException(ERROR_MESSAGES.CATEGORY_NOT_FOUND);
    }

    // Note: CASCADE DELETE
    await this.categoriesRepository.remove(category);
    return {
      message: 'Category and all associated committees deleted successfully',
    };
  }

  private async assertNameIsFree(name: string) {
    const existing = await this.categoriesRepository.findByName(name);

    if (existing) {
      throw new ConflictException(ERROR_MESSAGES.CATEGORY_ALREADY_EXISTS);
    }
  }
}
