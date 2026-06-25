import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StorageModule } from '../../storage/storage.module';
import { AdminRecruitmentController } from './admin-recruitment.controller';
import { AdminRecruitmentService } from './admin-recruitment.service';
import { Vacancy } from '../../recruitment/entities/vacancy.entity';
import { Application } from '../../recruitment/entities/application.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Vacancy, Application]),
    StorageModule,
  ],
  controllers: [AdminRecruitmentController],
  providers: [AdminRecruitmentService],
  exports: [AdminRecruitmentService],
})
export class AdminRecruitmentModule {}
