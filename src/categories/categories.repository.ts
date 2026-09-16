import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { CategoriesQueryDto } from './dto/categories-query.dto';
import { paginate, PaginatedResult } from 'src/common/utils/pagination.util';

@Injectable()
export class CategoriesRepository {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async findAllPaginated(
    query: CategoriesQueryDto,
  ): Promise<PaginatedResult<Category>> {
    const qb = this.categoryRepository
      .createQueryBuilder('category')
      .orderBy('category.name', 'ASC')
      .addOrderBy('category.id', 'ASC');

    const search = query.search?.trim();
    if (search) {
      qb.andWhere(
        '(category.name ILIKE :search OR category.description ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    if (query.type) {
      qb.andWhere('category.type = :type', { type: query.type });
    }

    return paginate(qb, query);
  }

  async findById(id: string): Promise<Category | null> {
    return this.categoryRepository.findOne({ where: { id } });
  }

  async findByNameAndType(name: string, type: string): Promise<Category | null> {
    return this.categoryRepository.findOne({ where: { name, type: type as any } });
  }

  create(data: Partial<Category>): Category {
    return this.categoryRepository.create(data);
  }

  async save(category: Category): Promise<Category> {
    return this.categoryRepository.save(category);
  }

  async remove(category: Category): Promise<Category> {
    return this.categoryRepository.remove(category);
  }
}
