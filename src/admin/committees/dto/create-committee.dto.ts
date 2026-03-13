import {
  IsNotEmpty,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { STRING_MAX_LENGTH } from 'src/constants/variables';

export class CreateCommitteeDto {
  @ApiProperty({
    description: 'Committee name',
    example: 'Robotics Committee',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(STRING_MAX_LENGTH)
  name: string;

  @ApiProperty({
    description: 'About section describing the committee',
    example:
      'The Robotics Committee focuses on building autonomous robots and promoting robotics education.',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(2000)
  about: string;

  @ApiProperty({
    description: 'Category ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsUUID()
  @IsNotEmpty()
  category_id: string;
}
