import { IsNotEmpty, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { STRING_MAX_LENGTH } from 'src/constants/variables';
import { IsHumanText } from 'src/decorators/human-text.decorator';

export class CreateCommitteeDto {
  @ApiProperty({
    description: 'Committee name',
    example: 'Web Development',
  })
  @IsHumanText({
    minLength: 2,
    maxLength: STRING_MAX_LENGTH,
    fieldLabel: 'name',
  })
  name!: string;

  @ApiProperty({
    description: 'About section describing the committee',
    example:
      'The Web Development Committee focuses on creating and maintaining the IEEE website and related web applications.',
  })
  @IsHumanText({ minLength: 6, maxLength: 2000, fieldLabel: 'about' })
  about!: string;

  @ApiProperty({
    description: 'Category ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsUUID()
  @IsNotEmpty()
  category_id!: string;
}
