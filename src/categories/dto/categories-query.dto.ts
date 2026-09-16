import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsEnum } from 'class-validator';
import { CategoryType } from 'src/categories/entities/category.entity';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';

export class CategoriesQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({
    type: String,
    description: 'Search by name or description',
  })
  @IsString()
  @IsOptional()
  search?: string;

  @ApiPropertyOptional({
    enum: CategoryType,
    description: 'Filter by category type',
  })
  @IsEnum(CategoryType)
  @IsOptional()
  type?: CategoryType;
}
