import { Module } from '@nestjs/common';
import { AwardsModule } from 'src/awards/awards.module';
import { AdminAwardsController } from './admin-awards.controller';
import { AdminAwardsService } from './admin-awards.service';

@Module({
  // AwardsRepository comes from the non-admin module so both sides share one
  // query surface for the entity.
  imports: [AwardsModule],
  controllers: [AdminAwardsController],
  providers: [AdminAwardsService],
})
export class AdminAwardsModule {}
