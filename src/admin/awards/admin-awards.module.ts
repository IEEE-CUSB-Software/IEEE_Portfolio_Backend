import { Module } from '@nestjs/common';
import { AwardsModule } from '../../awards/awards.module';
import { AdminAwardsController } from './admin-awards.controller';
import { AdminAwardsService } from './admin-awards.service';

@Module({
  imports: [AwardsModule],
  controllers: [AdminAwardsController],
  providers: [AdminAwardsService],
})
export class AdminAwardsModule {}
