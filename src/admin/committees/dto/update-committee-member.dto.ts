import { PartialType } from '@nestjs/swagger';
import { CreateCommitteeMemberDto } from './create-committee-member.dto';

export class UpdateCommitteeMemberDto extends PartialType(
  CreateCommitteeMemberDto,
) {}
