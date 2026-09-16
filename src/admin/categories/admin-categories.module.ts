import { Module } from '@nestjs/common';
import { CategoriesModule } from 'src/categories/categories.module';
import { AdminCategoriesController } from './admin-categories.controller';
import { AdminCategoriesService } from './admin-categories.service';

import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from 'src/categories/entities/category.entity';
import { Event } from 'src/events/entities/event.entity';
import { Workshop } from 'src/workshops/entities/workshop.entity';
import { Vacancy } from 'src/recruitment/entities/vacancy.entity';
import { Committee } from 'src/committees/entities/committee.entity';

@Module({
  imports: [
    CategoriesModule,
    TypeOrmModule.forFeature([Category, Event, Workshop, Vacancy, Committee]),
  ],
  controllers: [AdminCategoriesController],
  providers: [AdminCategoriesService],
})
export class AdminCategoriesModule {}
