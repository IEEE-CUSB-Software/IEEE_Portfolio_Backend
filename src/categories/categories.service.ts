import { Injectable } from '@nestjs/common';
import { paginatedResponse } from 'src/common/utils/pagination.util';
import { CategoriesRepository } from './categories.repository';
import { CategoriesQueryDto } from './dto/categories-query.dto';

@Injectable()
export class CategoriesService {
  constructor(private readonly categoriesRepository: CategoriesRepository) {}

  async findAll(query: CategoriesQueryDto) {
    return paginatedResponse(
      'categories',
      await this.categoriesRepository.findAllPaginated(query),
    );
  }
}
