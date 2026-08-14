import { ApiProperty } from '@nestjs/swagger';
import { STRING_MAX_LENGTH } from 'src/constants/variables';
import {
  IsHumanText,
  IsOptionalHumanText,
} from 'src/decorators/human-text.decorator';

export class CreateInstructorDto {
  @ApiProperty({
    description: 'Instructor name',
    example: 'Dr. Jane Doe',
  })
  @IsHumanText({
    minLength: 2,
    maxLength: STRING_MAX_LENGTH,
    fieldLabel: 'name',
  })
  name!: string;

  @ApiProperty({
    description: 'Instructor biography',
    example: 'Expert in Software Architecture with 10+ years of experience.',
    required: false,
  })
  @IsOptionalHumanText({ minLength: 2, maxLength: 1000, fieldLabel: 'bio' })
  bio?: string;
}
