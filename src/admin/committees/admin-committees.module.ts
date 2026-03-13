import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Committee } from 'src/committees/entities/committee.entity';
import { CommitteeMember } from 'src/committees/entities/committee-member.entity';
import { Category } from 'src/categories/entities/category.entity';
import { AdminCommitteesController } from './admin-committees.controller';
import { AdminCommitteeMembersController } from './admin-committee-members.controller';
import { AdminCommitteesService } from './admin-committees.service';
import { AdminCommitteeMembersService } from './admin-committee-members.service';

@Module({
  imports: [TypeOrmModule.forFeature([Committee, CommitteeMember, Category])],
  controllers: [AdminCommitteesController, AdminCommitteeMembersController],
  providers: [AdminCommitteesService, AdminCommitteeMembersService],
})
export class AdminCommitteesModule {}
