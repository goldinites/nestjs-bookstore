import {
  BadRequestException,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileService } from './file.service';
import { DeleteFileDto } from './dto/delete-file.dto';
import type {
  StoredFileResponse,
  UploadFileResponse,
} from './types/file.types';
import { FileFolders } from '@/modules/file/enums/folders.enum';
import { mapFilesToResponse } from '@/modules/file/mappers/file-to-response.mapper';
import { FileErrors } from '@/modules/file/enums/errors.enum';
import { GetFileDto } from '@/modules/file/dto/get-file.dto';
import { UploadType } from '@/modules/file/enums/upload-type.enum';
import { FilesUploadInterceptor } from '@/modules/file/interceptors/file-upload.interceptor';
import { RequiredFilePipe } from '@/modules/file/pipes/required-file.pipe';

@Controller('files')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post('images')
  @UseInterceptors(FilesUploadInterceptor(FileFolders.IMAGES, UploadType.IMAGE))
  uploadImages(
    @UploadedFiles(RequiredFilePipe())
    files: Express.Multer.File[],
  ): UploadFileResponse[] {
    if (!files?.length) throw new BadRequestException(FileErrors.FILE_REQUIRED);

    files.forEach((file) => {
      this.fileService.saveMetadata(FileFolders.IMAGES, file.filename, {
        originalName: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
      });
    });

    return mapFilesToResponse(files, FileFolders.IMAGES);
  }

  @Post('files')
  @UseInterceptors(FilesUploadInterceptor(FileFolders.FILES, UploadType.FILE))
  uploadFiles(
    @UploadedFiles(RequiredFilePipe())
    files: Express.Multer.File[],
  ): UploadFileResponse[] {
    if (!files?.length) throw new BadRequestException(FileErrors.FILE_REQUIRED);

    files.forEach((file) => {
      this.fileService.saveMetadata(FileFolders.FILES, file.filename, {
        originalName: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
      });
    });

    return mapFilesToResponse(files, FileFolders.FILES);
  }

  @Get(':fileId')
  getFile(@Param() params: GetFileDto): StoredFileResponse {
    const fileText = this.fileService.readFile(params.fileId);
    const fileMeta = this.fileService.readMetadata(params.fileId);

    if (!fileText || !fileMeta) {
      throw new NotFoundException();
    }

    return {
      fileId: params.fileId,
      originalName: fileMeta.originalName,
      mimetype: fileMeta.mimetype,
      size: fileMeta.size,
      data: fileText,
    };
  }

  @Delete(':fileId')
  deleteFile(@Param() params: DeleteFileDto): void {
    this.fileService.removeFile(params.fileId);
  }
}
