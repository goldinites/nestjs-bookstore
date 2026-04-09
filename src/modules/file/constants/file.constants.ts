import { join } from 'path';

export const UPLOADS_FOLDER = 'uploads';
export const UPLOADS_PATH = join(process.cwd(), UPLOADS_FOLDER);

export const IMAGE_UPLOAD_MIME_TYPES = /^image\/(png|jpeg|jpg|gif|webp)$/i;

export const DOCUMENT_UPLOAD_MIME_TYPES =
  /^(application\/(pdf|zip|gzip|msword|vnd\..+|csv)|text\/(plain|csv))$/i;

export const BINARY_MIME_TYPES =
  /^(image|audio|video|application\/(octet-stream|zip|pdf|x-rar-compressed|gzip|msword|vnd\..+))/i;

export const TEXT_MIME_TYPES =
  /^(text\/|application\/(json|xml|javascript|x-www-form-urlencoded|graphql|ld\+json))/i;

export const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
export const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB

export const MAX_FILE_COUNT = 10;
