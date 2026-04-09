import { existsSync, mkdirSync } from 'fs';
import { join, extname } from 'path';
import { randomUUID } from 'crypto';
import { diskStorage } from 'multer';
import type { MulterModuleOptions } from '@nestjs/platform-express';
import {
  IMAGE_UPLOAD_MIME_TYPES,
  DOCUMENT_UPLOAD_MIME_TYPES,
  MAX_FILE_SIZE,
  MAX_IMAGE_SIZE,
  UPLOADS_PATH,
} from '@/modules/file/constants/file.constants';
import { UploadType } from '@/modules/file/types/file.types';
import { FileErrors } from '@/modules/file/enums/errors.enum';
import { FileFolders } from '@/modules/file/enums/folders.enum';

const ensureDirectory = (directoryPath: string): void => {
  if (!existsSync(directoryPath)) {
    mkdirSync(directoryPath, { recursive: true });
  }
};

export const buildUploadPath = (folder: FileFolders): string => {
  const destination = join(UPLOADS_PATH, folder);
  ensureDirectory(destination);

  return destination;
};

export const createUploadOptions = (
  folder: FileFolders,
  type: UploadType = 'file',
): MulterModuleOptions => {
  const destination = buildUploadPath(folder);

  return {
    storage: diskStorage({
      destination,
      filename: (_req, file, callback) => {
        const fileExt = extname(file.originalname);
        callback(null, `${randomUUID()}${fileExt}`);
      },
    }),
    fileFilter: (_req, file, callback) => {
      if (type === 'image' && !IMAGE_UPLOAD_MIME_TYPES.test(file.mimetype)) {
        callback(new Error(FileErrors.NOT_AVAILABLE_TYPE), false);
        return;
      }

      if (type === 'file' && !DOCUMENT_UPLOAD_MIME_TYPES.test(file.mimetype)) {
        callback(new Error(FileErrors.NOT_AVAILABLE_TYPE), false);
        return;
      }

      callback(null, true);
    },
    limits: {
      fileSize: type === 'image' ? MAX_IMAGE_SIZE : MAX_FILE_SIZE,
    },
  };
};
