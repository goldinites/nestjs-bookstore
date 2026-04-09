import { Injectable } from '@nestjs/common';
import { existsSync, readFileSync, unlinkSync, writeFileSync } from 'fs';
import { join } from 'path';
import { buildUploadPath, createUploadOptions } from './helpers/file.helper';
import {
  BINARY_MIME_TYPES,
  TEXT_MIME_TYPES,
  UPLOADS_FOLDER,
  UPLOADS_PATH,
} from './constants/file.constants';
import {
  FileMetadata,
  FilePath,
  FileReadAs,
  UploadType,
} from '@/modules/file/types/file.types';
import { FileFolders } from '@/modules/file/enums/folders.enum';

@Injectable()
export class FileService {
  createUploadOptions(folder: FileFolders, type: UploadType = 'file') {
    return createUploadOptions(folder, type);
  }

  ensureFolder(folder: FileFolders): string {
    return buildUploadPath(folder);
  }

  buildPublicUrl(folder: FileFolders, filename: string): string {
    return `/${UPLOADS_FOLDER}/${folder}/${filename}`;
  }

  getFilePath(folder: FileFolders, fileId: string): string {
    return join(UPLOADS_PATH, folder, fileId);
  }

  getMetadataPath(folder: FileFolders, fileId: string): string {
    return `${this.getFilePath(folder, fileId)}.meta.json`;
  }

  saveMetadata(
    folder: FileFolders,
    fileId: string,
    metadata: FileMetadata,
  ): void {
    writeFileSync(
      this.getMetadataPath(folder, fileId),
      JSON.stringify(metadata),
    );
  }

  private getPossibleFilePaths(fileId: string): FilePath[] {
    return [
      {
        folder: FileFolders.IMAGES,
        path: this.getFilePath(FileFolders.IMAGES, fileId),
      },
      {
        folder: FileFolders.FILES,
        path: this.getFilePath(FileFolders.FILES, fileId),
      },
    ];
  }

  resolveFilePath(fileId: string): FilePath | null {
    return (
      this.getPossibleFilePaths(fileId).find(({ path }) => existsSync(path)) ??
      null
    );
  }

  readMetadata(fileId: string): FileMetadata | null {
    const resolved = this.resolveFilePath(fileId);

    if (!resolved) return null;

    const metadataPath = this.getMetadataPath(resolved.folder, fileId);

    if (!existsSync(metadataPath)) return null;

    return JSON.parse(readFileSync(metadataPath, 'utf8')) as FileMetadata;
  }

  getFileReadStrategy(mime: string): FileReadAs {
    if (TEXT_MIME_TYPES.test(mime)) return 'text';
    if (BINARY_MIME_TYPES.test(mime)) return 'base64';

    return 'unknown';
  }

  readFileAsBase64(fileId: string): string | null {
    const resolved = this.resolveFilePath(fileId);

    if (!resolved) return null;

    return readFileSync(resolved.path, 'base64');
  }

  readFileAsText(fileId: string): string | null {
    const resolved = this.resolveFilePath(fileId);

    if (!resolved) return null;

    return readFileSync(resolved.path, 'utf8');
  }

  readFile(fileId: string): string | null {
    const resolved: FilePath | null = this.resolveFilePath(fileId);

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

    const metadataPath = this.getMetadataPath(resolved.folder, fileId);

    if (existsSync(resolved.path)) {
      unlinkSync(resolved.path);
    }

    if (existsSync(metadataPath)) {
      unlinkSync(metadataPath);
    }
  }
}
