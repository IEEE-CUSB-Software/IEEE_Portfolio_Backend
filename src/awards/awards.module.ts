import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Award } from './entities/award.entity';
import { AwardsService } from './awards.service';
import { AwardsRepository } from './awards.repository';
import { AwardsController } from './awards.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Award])],
  providers: [AwardsService, AwardsRepository],
  controllers: [AwardsController],
  exports: [AwardsService, AwardsRepository],
})
export class AwardsModule {}
