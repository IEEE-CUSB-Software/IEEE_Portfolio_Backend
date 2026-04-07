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
import { MediaService } from 'src/media/media.service';
import { resolveMediaFolder } from 'src/media/media.utils';

@Injectable()
export class AdminCommitteeMembersService {
  constructor(
    @InjectRepository(CommitteeMember)
    private readonly committeeMemberRepository: Repository<CommitteeMember>,
    @InjectRepository(Committee)
    private readonly committeeRepository: Repository<Committee>,
    private readonly mediaService: MediaService,
  ) {}

  async create(createCommitteeMemberDto: CreateCommitteeMemberDto) {
    const committee = await this.committeeRepository.findOne({
      where: { id: createCommitteeMemberDto.committee_id },
    });

    if (!committee) {
      throw new BadRequestException(ERROR_MESSAGES.COMMITTEE_NOT_FOUND);
    }

    const member = this.committeeMemberRepository.create({
      ...createCommitteeMemberDto,
      image_url: null,
      image_public_id: null,
    });

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

    return this.committeeMemberRepository.save(member);
  }

  async uploadImage(id: string, image: any) {
    const member = await this.committeeMemberRepository.findOne({ where: { id } });

    if (!member) {
      throw new NotFoundException(ERROR_MESSAGES.COMMITTEE_MEMBER_NOT_FOUND);
    }

    if (!image) {
      throw new BadRequestException(ERROR_MESSAGES.IMAGE_IS_REQUIRED);
    }

    const previousPublicId = member.image_public_id;
    const folder = resolveMediaFolder('COMMITTEES_MEMBERS_IMAGES_FILE_NAME', 'committees-members');
    const uploadedImage = await this.mediaService.uploadImage(image, folder);

    member.image_url = uploadedImage.url;
    member.image_public_id = uploadedImage.public_id;

    const savedMember = await this.committeeMemberRepository.save(member);

    if (previousPublicId) {
      await this.mediaService.deleteImage(previousPublicId);
    }

    return savedMember;
  }

  async removeImage(id: string) {
    const member = await this.committeeMemberRepository.findOne({ where: { id } });

    if (!member) {
      throw new NotFoundException(ERROR_MESSAGES.COMMITTEE_MEMBER_NOT_FOUND);
    }

    if (!member.image_public_id) {
      throw new NotFoundException(ERROR_MESSAGES.IMAGE_NOT_FOUND);
    }

    const publicId = member.image_public_id;
    member.image_url = null;
    member.image_public_id = null;

    await this.committeeMemberRepository.save(member);
    await this.mediaService.deleteImage(publicId);

    return member;
  }

  async remove(id: string) {
    const member = await this.committeeMemberRepository.findOne({ where: { id } });

    if (!member) {
      throw new NotFoundException(ERROR_MESSAGES.COMMITTEE_MEMBER_NOT_FOUND);
    }

    await this.committeeMemberRepository.remove(member);

    if (member.image_public_id) {
      await this.mediaService.deleteImage(member.image_public_id);
    }

    return { message: 'Committee member deleted successfully' };
  }
}
