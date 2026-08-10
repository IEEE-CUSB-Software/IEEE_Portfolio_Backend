import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BoardController } from './board.controller';
import { BoardService } from './board.service';
import { BoardRepository } from './board.repository';
import { BoardMember } from './entities/board-member.entity';
import { CommitteesModule } from '../committees/committees.module';

@Module({
  imports: [TypeOrmModule.forFeature([BoardMember]), CommitteesModule],
  controllers: [BoardController],
  providers: [BoardService, BoardRepository],
  exports: [BoardService, BoardRepository],
})
export class BoardModule {}
