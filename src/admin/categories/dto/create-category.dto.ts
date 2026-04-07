import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { STRING_MAX_LENGTH } from 'src/constants/variables';

export class CreateCategoryDto {
  @ApiProperty({
    description: 'Category name',
    example: 'Technical',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(STRING_MAX_LENGTH)
  name!: string;

  @ApiProperty({
    description: 'Category description (optional)',
    example: 'Technical committees focused on engineering and technology',
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(500)
  description?: string;
}
