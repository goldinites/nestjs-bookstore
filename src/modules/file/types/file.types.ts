export type FileReadAs = 'text' | 'base64' | 'unknown';

export type UploadMode = 'single' | 'multiple';

export type FilesUploadInterceptorOptions = {
  fieldName?: string;
  maxCount?: number;
  mode?: UploadMode;
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
