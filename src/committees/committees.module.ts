import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommitteesController } from './committees.controller';
import { CommitteesService } from './committees.service';
import { CommitteeMembersController } from './committee-members.controller';
import { CommitteeMembersService } from './committee-members.service';
import { Committee } from './entities/committee.entity';
import { CommitteeMember } from './entities/committee-member.entity';
import { Category } from '../categories/entities/category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Committee, CommitteeMember, Category])],
  controllers: [CommitteesController, CommitteeMembersController],
  providers: [CommitteesService, CommitteeMembersService],
  exports: [CommitteesService, CommitteeMembersService],
})
export class CommitteesModule {}
