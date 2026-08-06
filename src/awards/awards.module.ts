import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AwardsController } from './awards.controller';
import { AwardsService } from './awards.service';
import { AwardsRepository } from './awards.repository';
import { Award } from './entities/award.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Award])],
  controllers: [AwardsController],
  providers: [AwardsService, AwardsRepository],
  exports: [AwardsService, AwardsRepository],
})
export class AwardsModule {}
