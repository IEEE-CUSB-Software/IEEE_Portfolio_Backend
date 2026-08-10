import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID } from 'class-validator';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';

export class CommitteesQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({
    type: String,
    format: 'uuid',
    description: 'Filter by category ID',
  })
  @IsUUID()
  @IsOptional()
  category_id?: string;

  @ApiPropertyOptional({ type: String, description: 'Search by name or about' })
  @IsString()
  @IsOptional()
  search?: string;
}
