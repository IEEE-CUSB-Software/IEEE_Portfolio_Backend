import { Injectable } from '@nestjs/common';
import { CommitteeMemberRole } from './entities/committee-member.entity';
import { CommitteeMembersRepository } from './committee-members.repository';

@Injectable()
export class CommitteeMembersService {
  constructor(
    private readonly committeeMembersRepository: CommitteeMembersRepository,
  ) {}

  private getRoleOrder(role: CommitteeMemberRole): number {
    const order = {
      [CommitteeMemberRole.HEAD]: 1,
      [CommitteeMemberRole.VICE_HEAD]: 2,
      [CommitteeMemberRole.MEMBER]: 3,
    };
    return order[role];
  }

  async findByCommittee(committeeId: string) {
    const members =
      await this.committeeMembersRepository.findByCommittee(committeeId);

    // Sort by role hierarchy, then by name
    members.sort((a, b) => {
      const roleComparison =
        this.getRoleOrder(a.role) - this.getRoleOrder(b.role);
      if (roleComparison !== 0) return roleComparison;
      return a.name.localeCompare(b.name);
    });

    return {
      members,
      count: members.length,
    };
  }
}
