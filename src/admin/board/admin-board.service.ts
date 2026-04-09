import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BoardMember } from 'src/board/entities/board-member.entity';
import { CreateBoardMemberDto } from './dto/create-board-member.dto';
import { UpdateBoardMemberDto } from './dto/update-board-member.dto';
import { ERROR_MESSAGES } from 'src/constants/swagger-messages';
import { MediaService } from 'src/media/media.service';
import { resolveMediaFolder } from 'src/media/media.utils';

const BOARD_MEDIA_FOLDER = resolveMediaFolder('BOARD_MEMBERS_IMAGES_FILE_NAME', 'board-members');

@Injectable()
export class AdminBoardService {
  constructor(
    @InjectRepository(BoardMember)
    private readonly boardRepository: Repository<BoardMember>,
    private readonly mediaService: MediaService,
  ) {}

  async create(createBoardMemberDto: CreateBoardMemberDto) {
    const member = this.boardRepository.create({
      ...createBoardMemberDto,
      image_url: null,
      image_public_id: null,
    });

    return await this.boardRepository.save(member);
  }

  async update(id: string, updateBoardMemberDto: UpdateBoardMemberDto) {
    const member = await this.boardRepository.findOne({ where: { id } });
    
    if (!member) {
      throw new NotFoundException(ERROR_MESSAGES.BOARD_MEMBER_NOT_FOUND);
    }

    Object.assign(member, updateBoardMemberDto);

    return this.boardRepository.save(member);
  }

  async uploadImage(id: string, image: any) {
    const member = await this.boardRepository.findOne({ where: { id } });

    if (!member) {
      throw new NotFoundException(ERROR_MESSAGES.BOARD_MEMBER_NOT_FOUND);
    }

    if (!image) {
      throw new BadRequestException(ERROR_MESSAGES.IMAGE_IS_REQUIRED);
    }

    const previousPublicId = member.image_public_id;
    const uploadedImage = await this.mediaService.uploadImage(image, BOARD_MEDIA_FOLDER);

    member.image_url = uploadedImage.url;
    member.image_public_id = uploadedImage.public_id;

    const savedMember = await this.boardRepository.save(member);

    if (previousPublicId) {
      await this.mediaService.deleteImage(previousPublicId);
    }

    return savedMember;
  }

  async removeImage(id: string) {
    const member = await this.boardRepository.findOne({ where: { id } });

    if (!member) {
      throw new NotFoundException(ERROR_MESSAGES.BOARD_MEMBER_NOT_FOUND);
    }

    if (!member.image_public_id) {
      throw new NotFoundException(ERROR_MESSAGES.IMAGE_NOT_FOUND);
    }

    const publicId = member.image_public_id;
    member.image_url = null;
    member.image_public_id = null;

    await this.boardRepository.save(member);
    await this.mediaService.deleteImage(publicId);

    return member;
  }

  async remove(id: string) {
    const member = await this.boardRepository.findOne({ where: { id } });
    
    if (!member) {
      throw new NotFoundException(ERROR_MESSAGES.BOARD_MEMBER_NOT_FOUND);
    }

    await this.boardRepository.remove(member);

    if (member.image_public_id) {
      await this.mediaService.deleteImage(member.image_public_id);
    }

    return { message: 'Board member deleted successfully' };
  }
}
