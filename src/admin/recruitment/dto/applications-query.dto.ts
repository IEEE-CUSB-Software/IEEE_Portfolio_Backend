import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsString } from 'class-validator';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';

export class ApplicationsQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({
    type: String,
    description: 'Search applicants by name, email, or university',
  })
  @IsString()
  @IsOptional()
  search?: string;

  @ApiPropertyOptional({ type: String, example: '2024-01-01' })
  @IsDateString()
  @IsOptional()
  startDate?: string;

  @ApiPropertyOptional({ type: String, example: '2024-01-31' })
  @IsDateString()
  @IsOptional()
  endDate?: string;
}
