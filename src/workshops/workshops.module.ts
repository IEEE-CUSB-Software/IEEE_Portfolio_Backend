import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Workshop } from './entities/workshop.entity';
import { Instructor } from './entities/instructor.entity';
import { WorkshopRegistration } from './entities/workshop-registration.entity';
import { WorkshopImage } from './entities/workshop-image.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Workshop,
      Instructor,
      WorkshopRegistration,
      WorkshopImage,
    ]),
  ],
  controllers: [],
  providers: [],
  exports: [],
})
export class WorkshopsModule {}
