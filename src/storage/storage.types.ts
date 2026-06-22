export interface UploadFileOptions {
  fileName: string;
  fileBuffer: Buffer;
  contentType?: string;
  metadata?: Record<string, string>;
  prefix?: string; // e.g., 'CV/', 'images/', 'documents/'
}

export interface UploadFileResponse {
  success: boolean;
  fileName: string;
  fileUrl: string;
  fileKey: string;
  size: number;
  uploadedAt: Date;
}

export interface DeleteFileResponse {
  success: boolean;
  fileName: string;
  deletedAt: Date;
}

export interface GetFileResponse {
  fileBuffer: Buffer;
  contentType: string;
  size: number;
}

export interface ListFilesResponse {
  files: FileMetadata[];
  totalCount: number;
  continuationToken?: string;
}

export interface FileMetadata {
  key: string;
  size: number;
  uploadedAt: Date;
  etag: string;
  contentType?: string;
}

export interface CopyFileOptions {
  sourcePath: string;
  destinationPath: string;
}

export interface CopyFileResponse {
  success: boolean;
  sourceFile: string;
  destinationFile: string;
  copiedAt: Date;
}
