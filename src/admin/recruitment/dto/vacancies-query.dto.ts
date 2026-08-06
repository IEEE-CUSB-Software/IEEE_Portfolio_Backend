import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';

export class VacanciesQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({
    type: String,
    description: 'Search by vacancy title or description',
  })
  @IsString()
  @IsOptional()
  search?: string;
}
