import {
  IsInt,
  IsNotEmpty,
  IsString,
  IsEnum,
  MaxLength,
  Min,
  Max,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { STRING_MAX_LENGTH } from 'src/constants/variables';
import { AwardSource } from 'src/awards/enums/award-source.enum';

export class CreateAwardDto {
  @ApiProperty({
    description: 'Award title',
    example: 'Best Technical Chapter',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(STRING_MAX_LENGTH)
  title!: string;

  @ApiProperty({
    description: 'Award description',
    example: 'Awarded for outstanding chapter performance and activities.',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(1000)
  description!: string;

  @ApiProperty({
    description: 'Year the award was won',
    example: 2025,
  })
  @IsInt()
  @Min(1900)
  @Max(new Date().getFullYear() + 1) // Allow up to next year
  year!: number;

  @ApiProperty({
    description: 'Source of the award',
    enum: AwardSource,
    example: AwardSource.GLOBAL,
  })
  @IsEnum(AwardSource)
  @IsNotEmpty()
  source!: AwardSource;

  @ApiProperty({
    description: 'How many times this award was won',
    example: 3,
  })
  @IsInt()
  @Min(0)
  won_count!: number;
}
