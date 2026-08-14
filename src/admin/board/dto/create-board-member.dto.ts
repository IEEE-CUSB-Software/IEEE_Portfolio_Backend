import { IsEmail, IsInt, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { STRING_MAX_LENGTH } from 'src/constants/variables';
import { IsHumanText } from 'src/decorators/human-text.decorator';

export class CreateBoardMemberDto {
  @ApiProperty({
    description: 'Board member name',
    example: 'Mario Raafat',
  })
  @IsHumanText({
    minLength: 2,
    maxLength: STRING_MAX_LENGTH,
    fieldLabel: 'name',
  })
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
  @IsHumanText({
    minLength: 2,
    maxLength: STRING_MAX_LENGTH,
    fieldLabel: 'role',
  })
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
