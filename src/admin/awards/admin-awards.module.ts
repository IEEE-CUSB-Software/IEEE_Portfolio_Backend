import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Award } from 'src/awards/entities/award.entity';
import { AdminAwardsController } from './admin-awards.controller';
import { AdminAwardsService } from './admin-awards.service';

@Module({
  imports: [TypeOrmModule.forFeature([Award])],
  controllers: [AdminAwardsController],
  providers: [AdminAwardsService],
})
export class AdminAwardsModule {}
