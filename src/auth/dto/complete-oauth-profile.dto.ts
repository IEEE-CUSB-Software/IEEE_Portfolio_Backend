import {
  IsNotEmpty,
  IsNumber,
  IsPhoneNumber,
  IsString,
  IsOptional,
  Min,
  Max,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CompleteOAuthProfileDto {
  @ApiProperty({ description: 'Faculty', example: 'Engineering' })
  @IsNotEmpty()
  @IsString()
  faculty!: string;

  @ApiProperty({ description: 'University', example: 'Cairo University' })
  @IsNotEmpty()
  @IsString()
  university!: string;
  
  @ApiProperty({
    description: 'Phone number',
    example: '+20-100-123-4567',
  })
  @IsNotEmpty()
  @IsString()
  @IsPhoneNumber(undefined, { message: 'Phone number must be valid' })
  phone!: string;

  @ApiProperty({
    description: 'Academic year',
    example: 3,
    minimum: 1,
    maximum: 6,
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Max(6)
  @Type(() => Number)
  academic_year!: number;

  @ApiPropertyOptional({ description: 'Username', example: 'marioraafat' })
  @IsOptional()
  @IsString()
  username?: string;

  @ApiPropertyOptional({
    description: 'Major or specialization',
    example: 'Web Development Team',
  })
  @IsOptional()
  @IsString()
  major?: string;
}
