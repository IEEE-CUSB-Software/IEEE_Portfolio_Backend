import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CommitteeMembersRepository } from 'src/committees/committee-members.repository';
import { CommitteesRepository } from 'src/committees/committees.repository';
import { CreateCommitteeMemberDto } from './dto/create-committee-member.dto';
import { UpdateCommitteeMemberDto } from './dto/update-committee-member.dto';
import { ERROR_MESSAGES } from 'src/constants/swagger-messages';
import { MediaService } from 'src/media/media.service';
import { resolveMediaFolder } from 'src/media/media.utils';

const COMMITTEE_MEMBERS_MEDIA_FOLDER = resolveMediaFolder(
  'COMMITTEES_MEMBERS_IMAGES_FILE_NAME',
  'committees-members',
);

@Injectable()
export class AdminCommitteeMembersService {
  constructor(
    private readonly committeeMembersRepository: CommitteeMembersRepository,
    private readonly committeesRepository: CommitteesRepository,
    private readonly mediaService: MediaService,
  ) {}

  async create(createCommitteeMemberDto: CreateCommitteeMemberDto) {
    await this.assertCommitteeExists(createCommitteeMemberDto.committee_id);

    const member = this.committeeMembersRepository.create({
      ...createCommitteeMemberDto,
      image_url: null,
      image_public_id: null,
    });

    return await this.committeeMembersRepository.save(member);
  }

  async update(id: string, updateCommitteeMemberDto: UpdateCommitteeMemberDto) {
    const member = await this.getMemberOrFail(id);

    // Validate committee exists if committee_id is being updated
    if (updateCommitteeMemberDto.committee_id) {
      await this.assertCommitteeExists(updateCommitteeMemberDto.committee_id);
    }

    Object.assign(member, updateCommitteeMemberDto);

    return this.committeeMembersRepository.save(member);
  }

  async uploadImage(id: string, image: any) {
    const member = await this.getMemberOrFail(id);

    if (!image) {
      throw new BadRequestException(ERROR_MESSAGES.IMAGE_IS_REQUIRED);
    }

    const previousPublicId = member.image_public_id;
    const uploadedImage = await this.mediaService.uploadImage(
      image,
      COMMITTEE_MEMBERS_MEDIA_FOLDER,
    );

    member.image_url = uploadedImage.url;
    member.image_public_id = uploadedImage.public_id;

    const savedMember = await this.committeeMembersRepository.save(member);

    if (previousPublicId) {
      await this.mediaService.deleteImage(previousPublicId);
    }

    return savedMember;
  }

  async removeImage(id: string) {
    const member = await this.getMemberOrFail(id);

    if (!member.image_public_id) {
      throw new NotFoundException(ERROR_MESSAGES.IMAGE_NOT_FOUND);
    }

    const publicId = member.image_public_id;
    member.image_url = null;
    member.image_public_id = null;

    await this.committeeMembersRepository.save(member);
    await this.mediaService.deleteImage(publicId);

    return member;
  }

  async remove(id: string) {
    const member = await this.getMemberOrFail(id);

    await this.committeeMembersRepository.remove(member);

    if (member.image_public_id) {
      await this.mediaService.deleteImage(member.image_public_id);
    }

    return { message: 'Committee member deleted successfully' };
  }

  private async getMemberOrFail(id: string) {
    const member = await this.committeeMembersRepository.findById(id);

    if (!member) {
      throw new NotFoundException(ERROR_MESSAGES.COMMITTEE_MEMBER_NOT_FOUND);
    }

    return member;
  }

  private async assertCommitteeExists(committeeId: string) {
    const committee = await this.committeesRepository.findById(committeeId);

    if (!committee) {
      throw new BadRequestException(ERROR_MESSAGES.COMMITTEE_NOT_FOUND);
    }
  }
}
