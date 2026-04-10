import {
  CallHandler,
  ExecutionContext,
  Injectable,
  mixin,
  NestInterceptor,
  Type,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { FileService } from '@/modules/file/file.service';
import { UploadType } from '@/modules/file/enums/upload-type.enum';
import { MAX_FILE_COUNT } from '@/modules/file/constants/file.constants';
import { FilesUploadInterceptorOptions } from '@/modules/file/types/file.types';

export function FilesUploadInterceptor(
  type: UploadType,
  options: FilesUploadInterceptorOptions = {},
): Type<NestInterceptor> {
  const {
    fieldName = 'files',
    maxCount = MAX_FILE_COUNT,
    mode = 'multiple',
  } = options;

  @Injectable()
  class MixinInterceptor implements NestInterceptor {
    constructor(private readonly fileService: FileService) {}

    intercept(context: ExecutionContext, next: CallHandler) {
      const uploadOptions = this.fileService.createUploadOptions(type);

      const interceptorClass =
        mode === 'single'
          ? FileInterceptor(fieldName, uploadOptions)
          : FilesInterceptor(fieldName, maxCount, uploadOptions);

      const interceptorInstance = new interceptorClass();

      return interceptorInstance.intercept(context, next);
    }
  }

  return mixin(MixinInterceptor);
}
