import { IsOptional, IsObject } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class ApplyToVacancyDto {
  @ApiPropertyOptional({
    description: 'Any extra fields required by the vacancy form',
    example: { why_join: 'I want to learn', portfolio: 'link' },
  })
  @IsOptional()
  @IsObject()
  extra_data?: Record<string, any>;
}
