import {
  CallHandler,
  ExecutionContext,
  Injectable,
  mixin,
  NestInterceptor,
  Type,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { FileService } from '@/modules/file/file.service';
import { FileFolders } from '@/modules/file/enums/folders.enum';
import { UploadType } from '@/modules/file/enums/upload-type.enum';
import { MAX_FILE_COUNT } from '@/modules/file/constants/file.constants';

export function FilesUploadInterceptor(
  type: UploadType,
  maxCount: number = MAX_FILE_COUNT,
): Type<NestInterceptor> {
  @Injectable()
  class MixinInterceptor implements NestInterceptor {
    constructor(private readonly fileService: FileService) {}

    intercept(context: ExecutionContext, next: CallHandler) {
      const folder =
        type === UploadType.IMAGE ? FileFolders.IMAGES : FileFolders.FILES;

      const interceptorClass = FilesInterceptor(
        'files',
        maxCount,
        this.fileService.createUploadOptions(folder, type),
      );

      const interceptorInstance = new interceptorClass();

      return interceptorInstance.intercept(context, next);
    }
  }

  return mixin(MixinInterceptor);
}
