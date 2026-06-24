import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { WorkshopRegistrationStatus } from '../entities/workshop-registration.entity';

export class UpdateWorkshopRegistrationStatusDto {
  @ApiProperty({
    description: 'Registration status',
    enum: WorkshopRegistrationStatus,
    example: WorkshopRegistrationStatus.ACCEPTED,
  })
  @IsEnum(WorkshopRegistrationStatus)
  status!: WorkshopRegistrationStatus;
}
