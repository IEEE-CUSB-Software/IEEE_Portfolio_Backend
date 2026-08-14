import { IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { STRING_MAX_LENGTH } from 'src/constants/variables';
import {
  IsHumanText,
  IsOptionalHumanText,
} from 'src/decorators/human-text.decorator';

export class CreateVacancyDto {
  @ApiProperty({ example: 'Backend Developer' })
  @IsHumanText({
    minLength: 6,
    maxLength: STRING_MAX_LENGTH,
    fieldLabel: 'title',
  })
  title!: string;

  @ApiPropertyOptional({ example: 'Develop and maintain backend services.' })
  @IsOptionalHumanText({
    minLength: 6,
    maxLength: 1000,
    fieldLabel: 'description',
  })
  description?: string;

  @ApiPropertyOptional({ example: true })
  @IsBoolean()
  @IsOptional()
  is_open?: boolean;
}
