import {
  FileFolder,
  UploadFileResponse,
} from '@/modules/file/types/file.types';
import { FileService } from '@/modules/file/file.service';

const fileService = new FileService();

export function mapFileToResponse(
  file: Express.Multer.File,
  folder: FileFolder,
): UploadFileResponse {
  return {
    filename: file.filename,
    originalName: file.originalname,
    url: fileService.buildPublicUrl(folder, file.filename),
    mimetype: file.mimetype,
    size: file.size,
  };
}
