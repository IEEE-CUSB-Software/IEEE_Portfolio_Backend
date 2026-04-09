import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsUUID, ArrayMinSize } from 'class-validator';

export class BulkRegisterUsersDto {
  @ApiProperty({
    description: 'Array of user IDs to register for the event',
    example: [
      '3f0f3f98-7c7b-49b3-b17b-0d7b0d27f9e1',
      '4a1a4a98-8c8b-50c3-c28b-1e8b1e38a0f2',
    ],
    type: [String],
  })
  @IsArray()
  @ArrayMinSize(1)
  @IsUUID('4', { each: true })
  user_ids!: string[];
}
