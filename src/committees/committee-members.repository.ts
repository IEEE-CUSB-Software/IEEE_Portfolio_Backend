import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import {
  CommitteeMember,
  CommitteeMemberRole,
} from './entities/committee-member.entity';

@Injectable()
export class CommitteeMembersRepository {
  constructor(
    @InjectRepository(CommitteeMember)
    private readonly committeeMemberRepository: Repository<CommitteeMember>,
  ) {}

  async findByCommittee(committeeId: string): Promise<CommitteeMember[]> {
    return this.committeeMemberRepository.find({
      where: { committee_id: committeeId },
    });
  }

  async findLeaders(): Promise<CommitteeMember[]> {
    return this.committeeMemberRepository.find({
      where: {
        role: In([CommitteeMemberRole.HEAD, CommitteeMemberRole.VICE_HEAD]),
      },
    });
  }

  async findById(id: string): Promise<CommitteeMember | null> {
    return this.committeeMemberRepository.findOne({ where: { id } });
  }

  create(data: Partial<CommitteeMember>): CommitteeMember {
    return this.committeeMemberRepository.create(data);
  }

  async save(member: CommitteeMember): Promise<CommitteeMember> {
    return this.committeeMemberRepository.save(member);
  }

  async remove(member: CommitteeMember): Promise<CommitteeMember> {
    return this.committeeMemberRepository.remove(member);
  }
}
