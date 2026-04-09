import { FileFolders } from '@/modules/file/enums/folders.enum';

export type UploadType = 'image' | 'file';

export type FileReadAs = 'text' | 'base64' | 'unknown';

export type FilePath = {
  folder: FileFolders;
  path: string;
};

export type UploadFileResponse = {
  fileId: string;
  originalName: string;
  url: string;
  mimetype: string;
  size: number;
};

export type StoredFileResponse = {
  fileId: string;
  originalName: string;
  mimetype: string;
  size: number;
  data: string;
};

export type FileMetadata = {
  originalName: string;
  mimetype: string;
  size: number;
};
