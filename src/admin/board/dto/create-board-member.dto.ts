import {
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { STRING_MAX_LENGTH } from 'src/constants/variables';

export class CreateBoardMemberDto {
  @ApiProperty({
    description: 'Board member name',
    example: 'Mario Raafat',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(STRING_MAX_LENGTH)
  name!: string;

  @ApiProperty({
    description: 'Board member email',
    example: 'mario.raafat@ieee.org',
  })
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @ApiProperty({
    description: 'Board member role',
    example: 'Chair & Vice Chair',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(STRING_MAX_LENGTH)
  role!: string;

  @ApiProperty({
    description: 'Display order (optional)',
    example: 1,
    required: false,
  })
  @IsInt()
  @IsOptional()
  display_order?: number;
}
