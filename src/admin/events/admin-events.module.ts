import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from 'src/events/entities/event.entity';
import { EventRegistration } from 'src/events/entities/event-registration.entity';
import { User } from 'src/users/entities/user.entity';
import { AdminEventsController } from './admin-events.controller';
import { AdminEventsService } from './admin-events.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Event, EventRegistration, User]),
  ],
  controllers: [AdminEventsController],
  providers: [AdminEventsService],
  exports: [AdminEventsService],
})
export class AdminEventsModule {}
