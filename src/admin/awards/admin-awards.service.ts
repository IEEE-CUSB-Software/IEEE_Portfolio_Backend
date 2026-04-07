import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Award } from 'src/awards/entities/award.entity';
import { CreateAwardDto } from './dto/create-award.dto';
import { UpdateAwardDto } from './dto/update-award.dto';
import { ERROR_MESSAGES } from 'src/constants/swagger-messages';
import { MediaService } from 'src/media/media.service';
import { resolveMediaFolder } from 'src/media/media.utils';

@Injectable()
export class AdminAwardsService {
  constructor(
    @InjectRepository(Award)
    private readonly awardsRepository: Repository<Award>,
    private readonly mediaService: MediaService,
  ) {}

  async create(createAwardDto: CreateAwardDto) {
    const award = this.awardsRepository.create({
      ...createAwardDto,
      image_url: null,
      image_public_id: null,
    });

    return await this.awardsRepository.save(award);
  }

  async update(id: string, updateAwardDto: UpdateAwardDto) {
    const award = await this.awardsRepository.findOne({ where: { id } });

    if (!award) {
      throw new NotFoundException(ERROR_MESSAGES.AWARD_NOT_FOUND);
    }

    Object.assign(award, updateAwardDto);

    return this.awardsRepository.save(award);
  }

  async uploadImage(id: string, image: any) {
    const award = await this.awardsRepository.findOne({ where: { id } });

    if (!award) {
      throw new NotFoundException(ERROR_MESSAGES.AWARD_NOT_FOUND);
    }

    if (!image) {
      throw new BadRequestException(ERROR_MESSAGES.IMAGE_IS_REQUIRED);
    }

    const previousPublicId = award.image_public_id;
    const folder = resolveMediaFolder('AWARDS_IMAGES_FILE_NAME', 'awards');
    const uploadedImage = await this.mediaService.uploadImage(image, folder);

    award.image_url = uploadedImage.url;
    award.image_public_id = uploadedImage.public_id;

    const savedAward = await this.awardsRepository.save(award);
    if (previousPublicId) {
      await this.mediaService.deleteImage(previousPublicId);
    }

    return savedAward;
  }

  async removeImage(id: string) {
    const award = await this.awardsRepository.findOne({ where: { id } });

    if (!award) {
      throw new NotFoundException(ERROR_MESSAGES.AWARD_NOT_FOUND);
    }

    if (!award.image_public_id) {
      throw new NotFoundException(ERROR_MESSAGES.IMAGE_NOT_FOUND);
    }

    const publicId = award.image_public_id;
    award.image_url = null;
    award.image_public_id = null;

    await this.awardsRepository.save(award);
    await this.mediaService.deleteImage(publicId);

    return award;
  }

  async remove(id: string) {
    const award = await this.awardsRepository.findOne({ where: { id } });

    if (!award) {
      throw new NotFoundException(ERROR_MESSAGES.AWARD_NOT_FOUND);
    }

    await this.awardsRepository.remove(award);

    if (award.image_public_id) {
      await this.mediaService.deleteImage(award.image_public_id);
    }

    return { message: 'Award deleted successfully' };
  }
}
