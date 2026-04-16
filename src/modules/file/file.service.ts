import { Injectable } from '@nestjs/common';
import {
  existsSync,
  mkdirSync,
  readFileSync,
  unlinkSync,
  writeFileSync,
} from 'fs';
import { extname, join } from 'path';
import {
  BINARY_MIME_TYPES,
  DOCUMENT_UPLOAD_MIME_TYPES,
  IMAGE_UPLOAD_MIME_TYPES,
  MAX_FILE_SIZE,
  MAX_IMAGE_SIZE,
  TEXT_MIME_TYPES,
  UPLOADS_FOLDER,
  UPLOADS_PATH,
} from './constants/file.constants';
import { FileMetadata, FileReadAs } from '@/modules/file/types/file.types';
import { UploadType } from '@/modules/file/enums/upload-type.enum';
import type { MulterModuleOptions } from '@nestjs/platform-express';
import { FileErrors } from '@/modules/file/enums/errors.enum';
import { diskStorage } from 'multer';
import { randomUUID } from 'crypto';

@Injectable()
export class FileService {
  private ensureDirectory(directoryPath: string): void {
    if (!existsSync(directoryPath)) {
      mkdirSync(directoryPath, { recursive: true });
    }
  }

  private buildUploadPath(): string {
    const destination = join(UPLOADS_PATH);
    this.ensureDirectory(destination);

    return destination;
  }

  private getFilePath(fileId: string): string {
    return join(UPLOADS_PATH, fileId);
  }

  private getMetadataPath(fileId: string): string {
    return `${this.getFilePath(fileId)}.meta.json`;
  }

  private resolveFilePath(fileId: string): string | null {
    const path = this.getFilePath(fileId);

    return existsSync(path) ? path : null;
  }

  private getFileReadStrategy(mime: string): FileReadAs {
    if (TEXT_MIME_TYPES.test(mime)) return 'text';
    if (BINARY_MIME_TYPES.test(mime)) return 'base64';

    return 'unknown';
  }

  private readFileAsBase64(fileId: string): string | null {
    const resolved = this.resolveFilePath(fileId);

    if (!resolved) return null;

    return readFileSync(resolved, 'base64');
  }

  private readFileAsText(fileId: string): string | null {
    const resolved = this.resolveFilePath(fileId);

    if (!resolved) return null;

    return readFileSync(resolved, 'utf8');
  }

  createUploadOptions(type: UploadType): MulterModuleOptions | undefined {
    const destination = this.buildUploadPath();

    return {
      storage: diskStorage({
        destination,
        filename: (_req, file, callback) => {
          const fileExt = extname(file.originalname);
          callback(null, `${randomUUID()}${fileExt}`);
        },
      }),
      fileFilter: (_req, file, callback) => {
        if (
          type === UploadType.IMAGE &&
          !IMAGE_UPLOAD_MIME_TYPES.test(file.mimetype)
        ) {
          callback(new Error(FileErrors.NOT_AVAILABLE_TYPE), false);
          return;
        }

        if (
          type === UploadType.FILE &&
          !DOCUMENT_UPLOAD_MIME_TYPES.test(file.mimetype)
        ) {
          callback(new Error(FileErrors.NOT_AVAILABLE_TYPE), false);
          return;
        }

        callback(null, true);
      },
      limits: {
        fileSize: type === UploadType.IMAGE ? MAX_IMAGE_SIZE : MAX_FILE_SIZE,
      },
    };
  }

  buildPublicUrl(filename: string): string {
    return `/${UPLOADS_FOLDER}/${filename}`;
  }

  readMetadata(fileId: string): FileMetadata | null {
    const resolved = this.resolveFilePath(fileId);

    if (!resolved) return null;

    const metadataPath = this.getMetadataPath(fileId);

    if (!existsSync(metadataPath)) return null;

    return JSON.parse(
      readFileSync(metadataPath, { encoding: 'utf8' }),
    ) as FileMetadata;
  }

  saveMetadata(fileId: string, metadata: FileMetadata): void {
    writeFileSync(this.getMetadataPath(fileId), JSON.stringify(metadata));
  }

  readFile(fileId: string): string | null {
    const resolved: string | null = this.resolveFilePath(fileId);

    if (!resolved) return null;

    const metadata: FileMetadata | null = this.readMetadata(fileId);

    if (!metadata) return null;

    const strategy = this.getFileReadStrategy(metadata.mimetype);

    switch (strategy) {
      case 'text':
        return this.readFileAsText(fileId);
      case 'base64':
        return this.readFileAsBase64(fileId);
      case 'unknown':
      default:
        return this.readFileAsBase64(fileId);
    }
  }

  removeFile(fileId: string): void {
    const resolved = this.resolveFilePath(fileId);

    if (!resolved) return;

    const metadataPath = this.getMetadataPath(fileId);

    if (existsSync(resolved)) {
      unlinkSync(resolved);
    }

    if (existsSync(metadataPath)) {
      unlinkSync(metadataPath);
    }
  }
}
