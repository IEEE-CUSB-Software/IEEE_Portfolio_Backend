import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Workshop } from './entities/workshop.entity';
import { Instructor } from './entities/instructor.entity';
import { WorkshopRegistration } from './entities/workshop-registration.entity';
import { WorkshopImage } from './entities/workshop-image.entity';
import { InstructorsController } from './instructors.controller';
import { InstructorsService } from './instructors.service';
import { WorkshopsController } from './workshops.controller';
import { WorkshopsService } from './workshops.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Workshop,
      Instructor,
      WorkshopRegistration,
      WorkshopImage,
    ]),
  ],
  controllers: [InstructorsController, WorkshopsController],
  providers: [InstructorsService, WorkshopsService],
  exports: [InstructorsService, WorkshopsService],
})
export class WorkshopsModule {}
