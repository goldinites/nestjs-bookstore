import {
  BadRequestException,
  Controller,
  Delete,
  Param,
  ParseFilePipeBuilder,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileService } from './file.service';
import { DeleteFileParamsDto } from './dto/delete-file-params.dto';
import type { UploadFileResponse } from './types/file.types';
import { createUploadOptions } from './helpers/file.helper';
import { FILE_FOLDERS } from '@/modules/file/constants/file.constants';
import { mapFileToResponse } from '@/modules/file/mappers/file-to-response.mapper';
import { FileErrors } from '@/modules/file/enums/errors.enum';

@Controller('files')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post('image')
  @UseInterceptors(
    FileInterceptor('file', createUploadOptions(FILE_FOLDERS.images, 'image')),
  )
  uploadImage(
    @UploadedFile(new ParseFilePipeBuilder().build({ fileIsRequired: true }))
    file: Express.Multer.File,
  ): UploadFileResponse {
    if (!file) throw new BadRequestException(FileErrors.FILE_REQUIRED);

    return mapFileToResponse(file, FILE_FOLDERS.images);
  }

  @Post('file')
  @UseInterceptors(
    FileInterceptor('file', createUploadOptions(FILE_FOLDERS.files, 'file')),
  )
  uploadFile(
    @UploadedFile(new ParseFilePipeBuilder().build({ fileIsRequired: true }))
    file: Express.Multer.File,
  ): UploadFileResponse {
    if (!file) throw new BadRequestException(FileErrors.FILE_REQUIRED);

    return mapFileToResponse(file, FILE_FOLDERS.files);
  }

  @Delete(':folder/:filename')
  deleteFile(@Param() params: DeleteFileParamsDto): void {
    this.fileService.removeFile(
      params.folder as keyof typeof FILE_FOLDERS,
      params.filename,
    );
  }
}
