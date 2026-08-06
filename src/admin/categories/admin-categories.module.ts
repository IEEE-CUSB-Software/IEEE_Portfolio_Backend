import { Module } from '@nestjs/common';
import { CategoriesModule } from 'src/categories/categories.module';
import { AdminCategoriesController } from './admin-categories.controller';
import { AdminCategoriesService } from './admin-categories.service';

@Module({
  // CategoriesRepository comes from the non-admin module so both sides share
  // one query surface for the entity.
  imports: [CategoriesModule],
  controllers: [AdminCategoriesController],
  providers: [AdminCategoriesService],
})
export class AdminCategoriesModule {}
