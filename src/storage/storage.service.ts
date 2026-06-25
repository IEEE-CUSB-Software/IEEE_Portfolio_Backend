import {
  Injectable,
  InternalServerErrorException,
  Logger,
  BadRequestException,
  NotFoundException,
  HttpException,
} from '@nestjs/common';
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  ListObjectsV2Command,
  CopyObjectCommand,
  HeadObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import {
  UploadFileOptions,
  UploadFileResponse,
  DeleteFileResponse,
  GetFileResponse,
  ListFilesResponse,
  FileMetadata,
  CopyFileOptions,
  CopyFileResponse,
} from './storage.types';
import { getR2Config } from './storage.config';
import { v4 as uuidv4 } from 'uuid';
import { fileTypeFromBuffer } from 'file-type';

@Injectable()
export class StorageService {
  private s3Client: S3Client;
  private config = getR2Config();
  private readonly logger = new Logger(StorageService.name);

  constructor() {
    this.validateConfig();
    this.initializeS3Client();
  }

  /**
   * Validates that all required R2 configuration is present
   */
  private validateConfig(): void {
    const requiredFields = ['endpoint', 'accessKeyId', 'accessKeySecret', 'bucketName'];
    const missingFields = requiredFields.filter((field) => !this.config[field]);

    if (missingFields.length > 0) {
      const errorMsg = `Missing R2 configuration: ${missingFields.join(', ')}`;
      this.logger.error(errorMsg);
      throw new InternalServerErrorException(errorMsg);
    }
  }

  private initializeS3Client(): void {
    this.s3Client = new S3Client({
      region: this.config.region,
      credentials: {
        accessKeyId: this.config.accessKeyId,
        secretAccessKey: this.config.accessKeySecret,
      },
      endpoint: this.config.endpoint,
      forcePathStyle: true,
    });

    this.logger.log(`S3 client initialized for bucket: ${this.config.bucketName} in region ${this.config.region}`);
  }

  /**
   * Uploads a file to Cloudflare R2
   * @param options - Upload options including file name, buffer, and optional metadata
   * @returns Upload response with file URL and details
   */
  async uploadFile(options: UploadFileOptions): Promise<UploadFileResponse> {
    const { fileName, fileBuffer, contentType = 'application/octet-stream', metadata = {}, prefix = '', allowedTypes = [], maxSize = 0 } = options;

    if (!fileName || !fileBuffer) {
      throw new BadRequestException('File name and buffer are required');
    }
    const detectedType = await fileTypeFromBuffer(fileBuffer);
    if (!detectedType) {
        throw new BadRequestException('Invalid or unreadable file content. Could not verify file type.');
      }

    if (allowedTypes.length > 0 && !allowedTypes.includes(detectedType.ext)) {
      throw new BadRequestException(`File type .${detectedType.ext} (${detectedType.mime}) is not allowed.`);
    }


    try {
      // Generate a unique file key to avoid collisions
      if (maxSize > 0 && fileBuffer.length > maxSize) {
        throw new BadRequestException(`File size exceeds the maximum allowed size of ${maxSize} bytes`);
      }
      const baseFileKey = `${uuidv4()}-${Date.now()}.${detectedType.ext}`;
      const fileKey = prefix ? `${prefix}${baseFileKey}` : baseFileKey;

      const command = new PutObjectCommand({
        Bucket: this.config.bucketName,
        Key: fileKey,
        Body: fileBuffer,
        ContentType: contentType,
        Metadata: metadata,
      });

      await this.s3Client.send(command);

      const fileUrl = `${this.config.endpoint}/${this.config.bucketName}/${fileKey}`;

      this.logger.log(`File uploaded successfully: ${fileKey}`);

      return {
        success: true,
        fileName: fileName,
        fileUrl: fileUrl,
        fileKey: fileKey,
        size: fileBuffer.length,
        uploadedAt: new Date(),
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      this.logger.error(`Failed to upload file: ${error.message}`, error.stack);
      throw new InternalServerErrorException(`Failed to upload file: ${error.message}`);
    }
  }

  /**
   * Retrieves a file from Cloudflare R2
   * @param fileKey - The file key/path in R2
   * @returns File buffer and metadata
   */
  async getFile(fileKey: string): Promise<GetFileResponse> {
    if (!fileKey) {
      throw new BadRequestException('File key is required');
    }

    try {
      const command = new GetObjectCommand({
        Bucket: this.config.bucketName,
        Key: fileKey,
      });

      const response = await this.s3Client.send(command);
      if (!response.Body) {
        throw new NotFoundException(`File content is empty for key: ${fileKey}`);
      }
      const fileBuffer = await response.Body.transformToByteArray();

      this.logger.log(`File retrieved successfully: ${fileKey}`);

      return {
        fileBuffer: Buffer.from(fileBuffer),
        contentType: response.ContentType || 'application/octet-stream',
        size: response.ContentLength || 0,
      };
    } catch (error) {
      if (error.name === 'NoSuchKey') {
        throw new NotFoundException(`File not found: ${fileKey}`);
      }
      this.logger.error(`Failed to retrieve file: ${error.message}`, error.stack);
      throw new InternalServerErrorException(`Failed to retrieve file: ${error.message}`);
    }
  }

  /**
   * Deletes a file from Cloudflare R2
   * @param fileKey - The file key/path in R2
   * @returns Deletion confirmation
   */
  async deleteFile(fileKey: string): Promise<DeleteFileResponse> {
    if (!fileKey) {
      throw new BadRequestException('File key is required');
    }

    try {
      const command = new DeleteObjectCommand({
        Bucket: this.config.bucketName,
        Key: fileKey,
      });

      await this.s3Client.send(command);

      this.logger.log(`File deleted successfully: ${fileKey}`);

      return {
        success: true,
        fileName: fileKey,
        deletedAt: new Date(),
      };
    } catch (error) {
      this.logger.error(`Failed to delete file: ${error.message}`, error.stack);
      throw new InternalServerErrorException(`Failed to delete file: ${error.message}`);
    }
  }

  /**
   * Lists all files in the R2 bucket with optional prefix filtering
   * @param prefix - Optional prefix to filter files
   * @param maxKeys - Maximum number of files to return (default: 100)
   * @param continuationToken - Token for pagination
   * @returns List of files with metadata
   */
  async listFiles(prefix?: string, maxKeys: number = 100, continuationToken?: string): Promise<ListFilesResponse> {
    try {
      const command = new ListObjectsV2Command({
        Bucket: this.config.bucketName,
        Prefix: prefix,
        MaxKeys: maxKeys,
        ContinuationToken: continuationToken,
      });

      const response = await this.s3Client.send(command);

      const files: FileMetadata[] = (response.Contents || []).map((obj) => ({
        key: obj.Key || '',
        size: obj.Size || 0,
        uploadedAt: obj.LastModified || new Date(),
        etag: obj.ETag || '',
      }));

      this.logger.log(`Listed ${files.length} files from R2 bucket`);

      return {
        files,
        totalCount: response.KeyCount || 0,
        continuationToken: response.NextContinuationToken,
      };
    } catch (error) {
      this.logger.error(`Failed to list files: ${error.message}`, error.stack);
      throw new InternalServerErrorException(`Failed to list files: ${error.message}`);
    }
  }

  /**
   * Copies a file within the R2 bucket
   * @param options - Copy options with source and destination paths
   * @returns Copy confirmation
   */
  async copyFile(options: CopyFileOptions): Promise<CopyFileResponse> {
    const { sourcePath, destinationPath } = options;

    if (!sourcePath || !destinationPath) {
      throw new BadRequestException('Source and destination paths are required');
    }

    try {
      const command = new CopyObjectCommand({
        Bucket: this.config.bucketName,
        CopySource: `${this.config.bucketName}/${sourcePath}`,
        Key: destinationPath,
      });

      await this.s3Client.send(command);

      this.logger.log(`File copied successfully from ${sourcePath} to ${destinationPath}`);

      return {
        success: true,
        sourceFile: sourcePath,
        destinationFile: destinationPath,
        copiedAt: new Date(),
      };
    } catch (error) {
      this.logger.error(`Failed to copy file: ${error.message}`, error.stack);
      throw new InternalServerErrorException(`Failed to copy file: ${error.message}`);
    }
  }

  /**
   * Generates a pre-signed URL for temporary file access
   * @param fileKey - The file key/path in R2
   * @param expirationSeconds - URL expiration time in seconds (default: 3600 = 1 hour)
   * @returns Pre-signed URL
   */
  async generatePresignedUrl(fileKey: string, expirationSeconds: number = 3600): Promise<string> {
    if (!fileKey) {
      throw new BadRequestException('File key is required');
    }

    try {
      const command = new GetObjectCommand({
        Bucket: this.config.bucketName,
        Key: fileKey,
      });

      const presignedUrl = await getSignedUrl(this.s3Client, command, {
        expiresIn: expirationSeconds,
      });

      this.logger.log(`Pre-signed URL generated for: ${fileKey}`);

      return presignedUrl;
    } catch (error) {
      this.logger.error(`Failed to generate pre-signed URL: ${error.message}`, error.stack);
      throw new InternalServerErrorException(`Failed to generate pre-signed URL: ${error.message}`);
    }
  }

  /**
   * Checks if a file exists in the R2 bucket
   * @param fileKey - The file key/path in R2
   * @returns Boolean indicating file existence
   */
  async fileExists(fileKey: string): Promise<boolean> {
    if (!fileKey) {
      throw new BadRequestException('File key is required');
    }

    try {
      const command = new HeadObjectCommand({
        Bucket: this.config.bucketName,
        Key: fileKey,
      });

      await this.s3Client.send(command);
      return true;
    } catch (error) {
      if (error.name === 'NotFound' || error.$metadata?.httpStatusCode === 404) {
        return false;
      }
      this.logger.error(`Error checking file existence: ${error.message}`, error.stack);
      throw new InternalServerErrorException(`Error checking file existence: ${error.message}`);
    }
  }

  /**
   * Retrieves file metadata without downloading the full file
   * @param fileKey - The file key/path in R2
   * @returns File metadata
   */
  async getFileMetadata(fileKey: string): Promise<FileMetadata> {
    if (!fileKey) {
      throw new BadRequestException('File key is required');
    }

    try {
      const command = new HeadObjectCommand({
        Bucket: this.config.bucketName,
        Key: fileKey,
      });

      const response = await this.s3Client.send(command);

      this.logger.log(`Metadata retrieved for: ${fileKey}`);

      return {
        key: fileKey,
        size: response.ContentLength || 0,
        uploadedAt: response.LastModified || new Date(),
        etag: response.ETag || '',
        contentType: response.ContentType,
      };
    } catch (error) {
      if (error.name === 'NoSuchKey') {
        throw new NotFoundException(`File not found: ${fileKey}`);
      }
      this.logger.error(`Failed to retrieve metadata: ${error.message}`, error.stack);
      throw new InternalServerErrorException(`Failed to retrieve metadata: ${error.message}`);
    }
  }

  /**
   * Cleanup method to close S3 client connections
   */
  async onModuleDestroy(): Promise<void> {
    if (this.s3Client) {
      await this.s3Client.destroy();
      this.logger.log('S3 client destroyed');
    }
  }
}
