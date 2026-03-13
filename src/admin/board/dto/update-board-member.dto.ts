import { PartialType } from '@nestjs/swagger';
import { CreateBoardMemberDto } from './create-board-member.dto';

export class UpdateBoardMemberDto extends PartialType(CreateBoardMemberDto) {}
