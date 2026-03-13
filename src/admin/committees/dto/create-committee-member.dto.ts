import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { STRING_MAX_LENGTH } from 'src/constants/variables';
import { CommitteeMemberRole } from 'src/committees/entities/committee-member.entity';

export class CreateCommitteeMemberDto {
  @ApiProperty({
    description: 'Committee ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsUUID()
  @IsNotEmpty()
  committee_id: string;

  @ApiProperty({
    description: 'Committee member name',
    example: 'Jane Smith',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(STRING_MAX_LENGTH)
  name: string;

  @ApiProperty({
    description: 'Committee member email',
    example: 'jane.smith@ieee.org',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'Committee member role',
    enum: CommitteeMemberRole,
    example: CommitteeMemberRole.HEAD,
  })
  @IsEnum(CommitteeMemberRole)
  @IsNotEmpty()
  role: CommitteeMemberRole;

  @ApiProperty({
    description: 'Committee member image URL',
    example: 'https://example.com/images/jane-smith.jpg',
  })
  @IsString()
  @IsNotEmpty()
  image_url: string;
}
