import { UploadFileResponse } from '@/modules/file/types/file.types';
import { FileService } from '@/modules/file/file.service';
import { FileFolders } from '@/modules/file/enums/folders.enum';

const fileService = new FileService();

export function mapFileToResponse(
  file: Express.Multer.File,
  folder: FileFolders,
): UploadFileResponse {
  return {
    fileId: file.filename,
    originalName: file.originalname,
    url: fileService.buildPublicUrl(folder, file.filename),
    mimetype: file.mimetype,
    size: file.size,
  };
}

export function mapFilesToResponse(
  files: Express.Multer.File[],
  folder: FileFolders,
): UploadFileResponse[] {
  return files.map((file) => mapFileToResponse(file, folder));
}
