import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';

export class BoardQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({ type: String, description: 'Search by name' })
  @IsString()
  @IsOptional()
  search?: string;

  @ApiPropertyOptional({ type: String, description: 'Filter by role' })
  @IsString()
  @IsOptional()
  role?: string;
}
