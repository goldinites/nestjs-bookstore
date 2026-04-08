import { FILE_FOLDERS } from '@/modules/file/constants/file.constants';

export type FileFolder = (typeof FILE_FOLDERS)[keyof typeof FILE_FOLDERS];

export type UploadType = 'image' | 'file';

export type UploadFileResponse = {
  filename: string;
  originalName: string;
  url: string;
  mimetype: string;
  size: number;
};
