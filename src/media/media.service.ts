import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { UploadedMedia } from './media.types';
import { StorageService } from '../storage/storage.service';

@Injectable()
export class MediaService {
  constructor(private readonly storageService: StorageService) {}

  async uploadImage(file: any, folder: string): Promise<UploadedMedia> {
    try {
      const response = await this.storageService.uploadFile({
        fileName: file.originalname,
        fileBuffer: file.buffer,
        contentType: file.mimetype,
        prefix: `${folder}/`,
      });

      return {
        url: response.fileUrl,
        public_id: response.fileKey,
        bytes: response.size,
      };
    } catch (error) {
      throw new InternalServerErrorException(`Failed to upload image: ${error.message}`);
    }
  }

  async deleteImage(publicId: string): Promise<void> {
    try {
      await this.storageService.deleteFile(publicId);
    } catch (error) {
      throw new InternalServerErrorException(`Failed to delete image: ${error.message}`);
    }
  }

  async uploadDocument(file: any, folder: string): Promise<UploadedMedia> {
    try {
      const response = await this.storageService.uploadFile({
        fileName: file.originalname,
        fileBuffer: file.buffer,
        contentType: file.mimetype,
        prefix: `${folder}/`,
      });

      return {
        url: response.fileUrl,
        public_id: response.fileKey,
        bytes: response.size,
      };
    } catch (error) {
      throw new InternalServerErrorException(`Failed to upload document: ${error.message}`);
    }
  }
}
