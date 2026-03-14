import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AwardsController } from './awards.controller';
import { AwardsService } from './awards.service';
import { Award } from './entities/award.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Award])],
  controllers: [AwardsController],
  providers: [AwardsService],
  exports: [AwardsService],
})
export class AwardsModule {}
