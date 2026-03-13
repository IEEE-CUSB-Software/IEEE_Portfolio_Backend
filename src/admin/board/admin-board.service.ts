import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BoardMember } from 'src/board/entities/board-member.entity';
import { CreateBoardMemberDto } from './dto/create-board-member.dto';
import { UpdateBoardMemberDto } from './dto/update-board-member.dto';
import { ERROR_MESSAGES } from 'src/constants/swagger-messages';

@Injectable()
export class AdminBoardService {
  constructor(
    @InjectRepository(BoardMember)
    private readonly boardRepository: Repository<BoardMember>,
  ) {}

  async create(createBoardMemberDto: CreateBoardMemberDto) {
    const member = this.boardRepository.create(createBoardMemberDto);
    return await this.boardRepository.save(member);
  }

  async update(id: string, updateBoardMemberDto: UpdateBoardMemberDto) {
    const member = await this.boardRepository.findOne({ where: { id } });
    
    if (!member) {
      throw new NotFoundException(ERROR_MESSAGES.BOARD_MEMBER_NOT_FOUND);
    }

    Object.assign(member, updateBoardMemberDto);
    return await this.boardRepository.save(member);
  }

  async remove(id: string) {
    const member = await this.boardRepository.findOne({ where: { id } });
    
    if (!member) {
      throw new NotFoundException(ERROR_MESSAGES.BOARD_MEMBER_NOT_FOUND);
    }

    await this.boardRepository.remove(member);
    return { message: 'Board member deleted successfully' };
  }
}
