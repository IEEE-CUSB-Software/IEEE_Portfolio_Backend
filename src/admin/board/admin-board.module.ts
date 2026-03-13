import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BoardMember } from 'src/board/entities/board-member.entity';
import { AdminBoardController } from './admin-board.controller';
import { AdminBoardService } from './admin-board.service';

@Module({
  imports: [TypeOrmModule.forFeature([BoardMember])],
  controllers: [AdminBoardController],
  providers: [AdminBoardService],
})
export class AdminBoardModule {}
