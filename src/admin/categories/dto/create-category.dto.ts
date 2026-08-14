import { ApiProperty } from '@nestjs/swagger';
import { STRING_MAX_LENGTH } from 'src/constants/variables';
import {
  IsHumanText,
  IsOptionalHumanText,
} from 'src/decorators/human-text.decorator';

export class CreateCategoryDto {
  @ApiProperty({
    description: 'Category name',
    example: 'Technical',
  })
  @IsHumanText({
    minLength: 2,
    maxLength: STRING_MAX_LENGTH,
    fieldLabel: 'name',
  })
  name!: string;

  @ApiProperty({
    description: 'Category description (optional)',
    example: 'Technical committees focused on engineering and technology',
    required: false,
  })
  @IsOptionalHumanText({
    minLength: 6,
    maxLength: 500,
    fieldLabel: 'description',
  })
  description?: string;
}
