import { Module } from '@nestjs/common';
import { CommitteesModule } from 'src/committees/committees.module';
import { CategoriesModule } from 'src/categories/categories.module';
import { AdminCommitteesController } from './admin-committees.controller';
import { AdminCommitteeMembersController } from './admin-committee-members.controller';
import { AdminCommitteesService } from './admin-committees.service';
import { AdminCommitteeMembersService } from './admin-committee-members.service';

@Module({
  // Repositories come from the non-admin modules so both sides share one
  // query surface per entity.
  imports: [CommitteesModule, CategoriesModule],
  controllers: [AdminCommitteesController, AdminCommitteeMembersController],
  providers: [AdminCommitteesService, AdminCommitteeMembersService],
})
export class AdminCommitteesModule {}
