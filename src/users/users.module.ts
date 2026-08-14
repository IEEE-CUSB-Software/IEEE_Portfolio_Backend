import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { RolesModule } from 'src/roles/roles.module';
import { StorageModule } from 'src/storage/storage.module';
import { UsersRepository } from './users.repository';
import { EventRegistration } from 'src/events/entities/event-registration.entity';
import { WorkshopRegistration } from 'src/workshops/entities/workshop-registration.entity';
import { Application } from 'src/recruitment/entities/application.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      EventRegistration,
      WorkshopRegistration,
      Application,
    ]),
    RolesModule,
    StorageModule,
  ],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository],
  exports: [UsersService, UsersRepository],
})
export class UsersModule {}
