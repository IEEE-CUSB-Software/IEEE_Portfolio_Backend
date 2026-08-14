import { IsInt, IsNotEmpty, IsEnum, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { STRING_MAX_LENGTH } from 'src/constants/variables';
import { AwardSource } from 'src/awards/enums/award-source.enum';
import { IsHumanText } from 'src/decorators/human-text.decorator';

export class CreateAwardDto {
  @ApiProperty({
    description: 'Award title',
    example: 'Best Technical Chapter',
  })
  @IsHumanText({
    minLength: 6,
    maxLength: STRING_MAX_LENGTH,
    fieldLabel: 'title',
  })
  title!: string;

  @ApiProperty({
    description: 'Award description',
    example: 'Awarded for outstanding chapter performance and activities.',
  })
  @IsHumanText({ minLength: 6, maxLength: 1000, fieldLabel: 'description' })
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
