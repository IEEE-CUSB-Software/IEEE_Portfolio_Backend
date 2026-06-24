import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Workshop } from 'src/workshops/entities/workshop.entity';
import { Instructor } from 'src/workshops/entities/instructor.entity';
import { WorkshopRegistration } from 'src/workshops/entities/workshop-registration.entity';
import { WorkshopImage } from 'src/workshops/entities/workshop-image.entity';
import { User } from 'src/users/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Workshop,
      Instructor,
      WorkshopRegistration,
      WorkshopImage,
      User,
    ]),
  ],
  controllers: [],
  providers: [],
  exports: [],
})
export class AdminWorkshopsModule {}
