import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommitteesController } from './committees.controller';
import { CommitteesService } from './committees.service';
import { CommitteesRepository } from './committees.repository';
import { CommitteeMembersController } from './committee-members.controller';
import { CommitteeMembersService } from './committee-members.service';
import { CommitteeMembersRepository } from './committee-members.repository';
import { Committee } from './entities/committee.entity';
import { CommitteeMember } from './entities/committee-member.entity';
import { Category } from '../categories/entities/category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Committee, CommitteeMember, Category])],
  controllers: [CommitteesController, CommitteeMembersController],
  providers: [
    CommitteesService,
    CommitteeMembersService,
    CommitteesRepository,
    CommitteeMembersRepository,
  ],
  exports: [
    CommitteesService,
    CommitteeMembersService,
    CommitteesRepository,
    CommitteeMembersRepository,
  ],
})
export class CommitteesModule {}
