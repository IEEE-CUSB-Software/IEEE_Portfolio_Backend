import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Workshop } from 'src/workshops/entities/workshop.entity';
import { Instructor } from 'src/workshops/entities/instructor.entity';
import { WorkshopRegistration } from 'src/workshops/entities/workshop-registration.entity';
import { WorkshopImage } from 'src/workshops/entities/workshop-image.entity';
import { User } from 'src/users/entities/user.entity';
import { MediaModule } from 'src/media/media.module';
import { AdminInstructorsController } from './admin-instructors.controller';
import { AdminInstructorsService } from './admin-instructors.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Workshop,
      Instructor,
      WorkshopRegistration,
      WorkshopImage,
      User,
    ]),
    MediaModule,
  ],
  controllers: [AdminInstructorsController],
  providers: [AdminInstructorsService],
  exports: [AdminInstructorsService],
})
export class AdminWorkshopsModule {}
