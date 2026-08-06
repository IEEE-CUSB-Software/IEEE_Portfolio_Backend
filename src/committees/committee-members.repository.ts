import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CommitteeMember } from './entities/committee-member.entity';

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
