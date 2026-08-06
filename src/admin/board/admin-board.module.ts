import { Module } from '@nestjs/common';
import { BoardModule } from 'src/board/board.module';
import { AdminBoardController } from './admin-board.controller';
import { AdminBoardService } from './admin-board.service';

@Module({
  // BoardRepository comes from the non-admin module so both sides share one
  // query surface for the entity.
  imports: [BoardModule],
  controllers: [AdminBoardController],
  providers: [AdminBoardService],
})
export class AdminBoardModule {}
