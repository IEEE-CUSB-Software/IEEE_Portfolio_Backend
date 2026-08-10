import {
  IsArray,
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { STRING_MAX_LENGTH } from 'src/constants/variables';

export class WorkshopContentDto {
  @ApiProperty({ description: 'Section title', example: 'Introduction' })
  @IsString()
  @IsNotEmpty()
  sectionTitle!: string;

  @ApiProperty({
    description: 'Subsections',
    example: ['HTML Basics', 'CSS Basics'],
  })
  @IsArray()
  @IsString({ each: true })
  subSection!: string[];
}

export class CreateWorkshopDto {
  @ApiProperty({
    description: 'Workshop title',
    example: 'IEEE Web Development Workshop',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(STRING_MAX_LENGTH)
  title!: string;

  @ApiProperty({
    description: 'Workshop description summary',
    example: 'A comprehensive crash course on modern web development.',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(1000)
  description!: string;

  @ApiProperty({
    description:
      'Detailed workshop content / syllabus outlining what they will learn',
    type: [WorkshopContentDto],
    example: [
      {
        sectionTitle: 'Introduction',
        subSection: ['HTML Basics', 'CSS Basics'],
      },
    ],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => WorkshopContentDto)
  content!: WorkshopContentDto[];

  @ApiProperty({
    description: 'Workshop location',
    example: 'Lab 3, Building C',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(STRING_MAX_LENGTH)
  location!: string;

  @ApiProperty({
    description: 'Workshop start time (ISO 8601)',
    example: '2026-04-10T10:00:00Z',
  })
  @IsDateString()
  start_time!: string;

  @ApiProperty({
    description: 'Workshop end time (ISO 8601)',
    example: '2026-04-10T14:00:00Z',
  })
  @IsDateString()
  end_time!: string;

  @ApiProperty({
    description: 'Maximum number of attendees',
    example: 50,
    minimum: 1,
  })
  @IsInt()
  @Min(1)
  capacity!: number;

  @ApiProperty({
    description: 'Registration deadline (ISO 8601)',
    example: '2026-04-05T23:59:59Z',
  })
  @IsDateString()
  registration_deadline!: string;

  @ApiProperty({
    description: 'List of instructor IDs assigned to this workshop',
    example: ['a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d'],
    required: false,
    type: [String],
  })
  @IsArray()
  @IsUUID(undefined, { each: true })
  @IsOptional()
  instructor_ids?: string[];
}
