import { UploadFileResponse } from '@/modules/file/types/file.types';
import { FileService } from '@/modules/file/file.service';

const fileService = new FileService();

export function mapFileToResponse(
  file: Express.Multer.File,
): UploadFileResponse {
  return {
    fileId: file.filename,
    originalName: file.originalname,
    url: fileService.buildPublicUrl(file.filename),
    mimetype: file.mimetype,
    size: file.size,
  };
}

export function mapFilesToResponse(
  files: Express.Multer.File[],
): UploadFileResponse[] {
  return files.map(mapFileToResponse);
}
