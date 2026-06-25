import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { STRING_MAX_LENGTH } from 'src/constants/variables';

export class CreateInstructorDto {
  @ApiProperty({
    description: 'Instructor name',
    example: 'Dr. Jane Doe',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(STRING_MAX_LENGTH)
  name!: string;

  @ApiProperty({
    description: 'Instructor biography',
    example: 'Expert in Software Architecture with 10+ years of experience.',
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(1000)
  bio?: string;
}
