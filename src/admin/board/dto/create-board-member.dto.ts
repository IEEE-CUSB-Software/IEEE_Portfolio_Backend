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
    example: 'John Doe',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(STRING_MAX_LENGTH)
  name: string;

  @ApiProperty({
    description: 'Board member email',
    example: 'john.doe@ieee.org',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'Board member role',
    example: 'President',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(STRING_MAX_LENGTH)
  role: string;

  @ApiProperty({
    description: 'Board member image URL',
    example: 'https://example.com/images/john-doe.jpg',
  })
  @IsString()
  @IsNotEmpty()
  image_url: string;

  @ApiProperty({
    description: 'Display order (optional)',
    example: 1,
    required: false,
  })
  @IsInt()
  @IsOptional()
  display_order?: number;
}
