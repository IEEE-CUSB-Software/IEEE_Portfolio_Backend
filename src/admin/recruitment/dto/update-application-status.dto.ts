import { IsEnum, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateApplicationStatusDto {
  @ApiProperty({
    enum: ['PENDING', 'ACCEPTED', 'REJECTED'],
    example: 'ACCEPTED',
  })
  @IsEnum(['PENDING', 'ACCEPTED', 'REJECTED'])
  @IsNotEmpty()
  status!: 'PENDING' | 'ACCEPTED' | 'REJECTED';
}
