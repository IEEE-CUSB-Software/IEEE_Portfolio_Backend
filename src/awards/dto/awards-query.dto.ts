import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString } from 'class-validator';
import {
  PaginationQueryDto,
  toOptionalNumber,
} from 'src/common/dto/pagination-query.dto';
import { AwardSource } from '../enums/award-source.enum';

export class AwardsQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({
    type: String,
    description: 'Search by title or description',
  })
  @IsString()
  @IsOptional()
  search?: string;

  @ApiPropertyOptional({
    type: Number,
    example: 2024,
    description: 'Filter by award year',
  })
  @Transform(toOptionalNumber)
  @IsInt()
  @IsOptional()
  year?: number;

  @ApiPropertyOptional({
    enum: AwardSource,
    description: 'Filter by award source',
  })
  @IsEnum(AwardSource)
  @IsOptional()
  source?: AwardSource;
}
