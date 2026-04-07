import {
  IsInt,
  IsNotEmpty,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { STRING_MAX_LENGTH } from 'src/constants/variables';

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
    description: 'How many times this award was won',
    example: 3,
  })
  @IsInt()
  @Min(0)
  won_count!: number;
}
