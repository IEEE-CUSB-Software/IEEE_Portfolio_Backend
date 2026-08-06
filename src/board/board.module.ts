import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BoardController } from './board.controller';
import { BoardService } from './board.service';
import { BoardRepository } from './board.repository';
import { BoardMember } from './entities/board-member.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BoardMember])],
  controllers: [BoardController],
  providers: [BoardService, BoardRepository],
  exports: [BoardService, BoardRepository],
})
export class BoardModule {}
