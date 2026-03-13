import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CommitteeMember } from 'src/committees/entities/committee-member.entity';
import { Committee } from 'src/committees/entities/committee.entity';
import { CreateCommitteeMemberDto } from './dto/create-committee-member.dto';
import { UpdateCommitteeMemberDto } from './dto/update-committee-member.dto';
import { ERROR_MESSAGES } from 'src/constants/swagger-messages';

@Injectable()
export class AdminCommitteeMembersService {
  constructor(
    @InjectRepository(CommitteeMember)
    private readonly committeeMemberRepository: Repository<CommitteeMember>,
    @InjectRepository(Committee)
    private readonly committeeRepository: Repository<Committee>,
  ) {}

  async create(createCommitteeMemberDto: CreateCommitteeMemberDto) {
    const committee = await this.committeeRepository.findOne({
      where: { id: createCommitteeMemberDto.committee_id },
    });

    if (!committee) {
      throw new BadRequestException(ERROR_MESSAGES.COMMITTEE_NOT_FOUND);
    }

    const member = this.committeeMemberRepository.create(createCommitteeMemberDto);
    return await this.committeeMemberRepository.save(member);
  }

  async update(id: string, updateCommitteeMemberDto: UpdateCommitteeMemberDto) {
    const member = await this.committeeMemberRepository.findOne({ where: { id } });

    if (!member) {
      throw new NotFoundException(ERROR_MESSAGES.COMMITTEE_MEMBER_NOT_FOUND);
    }

    // Validate committee exists if committee_id is being updated
    if (updateCommitteeMemberDto.committee_id) {
      const committee = await this.committeeRepository.findOne({
        where: { id: updateCommitteeMemberDto.committee_id },
      });

      if (!committee) {
        throw new BadRequestException(ERROR_MESSAGES.COMMITTEE_NOT_FOUND);
      }
    }

    Object.assign(member, updateCommitteeMemberDto);
    return await this.committeeMemberRepository.save(member);
  }

  async remove(id: string) {
    const member = await this.committeeMemberRepository.findOne({ where: { id } });

    if (!member) {
      throw new NotFoundException(ERROR_MESSAGES.COMMITTEE_MEMBER_NOT_FOUND);
    }

    await this.committeeMemberRepository.remove(member);
    return { message: 'Committee member deleted successfully' };
  }
}
