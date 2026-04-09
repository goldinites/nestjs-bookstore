import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseArrayPipe,
  ParseFilePipeBuilder,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { BookService } from '@/modules/book/book.service';
import { GetBookReqDto } from '@/modules/book/dto/get-book.dto';
import { CreateBookDto } from '@/modules/book/dto/create-book.dto';
import { UpdateBookDto } from '@/modules/book/dto/update-book.dto';
import { Book } from '@/modules/book/entities/book.entity';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';
import { RolesGuard } from '@/modules/auth/guards/roles.guard';
import { Permissions } from '@/modules/auth/decorators/permissions.decorator';
import { Roles } from '@/modules/user/enums/roles.enum';
import { BookResponse } from '@/modules/book/types/book.type';
import {
  mapBooksToResponse,
  mapBookToResponse,
} from '@/modules/book/mappers/book-to-response.mapper';
import { BookErrors } from '@/modules/book/enums/errors.enum';
import { FileService } from '@/modules/file/file.service';
import { FileFolders } from '@/modules/file/enums/folders.enum';
import { FileInterceptor } from '@nestjs/platform-express';
import { createUploadOptions } from '@/modules/file/helpers/file.helper';
import { UploadType } from '@/modules/file/enums/upload-type.enum';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('book')
export class BookController {
  constructor(
    private readonly bookService: BookService,
    private readonly fileService: FileService,
  ) {}

  @Get()
  async getBooks(@Query() query: GetBookReqDto): Promise<BookResponse[]> {
    const books: Book[] = await this.bookService.getBooks(query);

    if (books.length === 0) return [];

    return mapBooksToResponse(books);
  }

  @Get(':id')
  async getBookById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<BookResponse> {
    const book: Book | null = await this.bookService.getBookById(id);

    if (!book) throw new NotFoundException(BookErrors.NOT_FOUND);

    return mapBookToResponse(book);
  }

  @Post()
  @Permissions(Roles.ADMIN)
  async createBook(@Body() payload: CreateBookDto): Promise<BookResponse> {
    const book: Book = await this.bookService.createBook(payload);

    return mapBookToResponse(book);
  }

  @Post('import')
  @Permissions(Roles.ADMIN)
  async importBooks(
    @Body(new ParseArrayPipe({ items: CreateBookDto }))
    payload: CreateBookDto[],
  ): Promise<BookResponse[]> {
    const books: Book[] = await this.bookService.importBooks(payload);

    if (books.length === 0) return [];

    return mapBooksToResponse(books);
  }

  @Patch(':id')
  @Permissions(Roles.ADMIN)
  async updateBook(
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: UpdateBookDto,
  ): Promise<BookResponse> {
    const book: Book | null = await this.bookService.updateBook(id, payload);

    if (!book) throw new BadRequestException(BookErrors.NOT_UPDATED);

    return mapBookToResponse(book);
  }

  @Patch(':id/image')
  @Permissions(Roles.ADMIN)
  @UseInterceptors(
    FileInterceptor(
      'file',
      createUploadOptions(FileFolders.IMAGES, UploadType.IMAGE),
    ),
  )
  async updateBookImage(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile(new ParseFilePipeBuilder().build({ fileIsRequired: true }))
    file: Express.Multer.File,
  ): Promise<BookResponse> {
    if (!file) throw new BadRequestException(BookErrors.IMAGE_REQUIRED);

    this.fileService.saveMetadata(FileFolders.IMAGES, file.filename, {
      originalName: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
    });

    const imageUrl = this.fileService.buildPublicUrl(
      FileFolders.IMAGES,
      file.filename,
    );

    const book: Book | null = await this.bookService.updateBookImage(
      id,
      imageUrl,
    );

    if (!book) throw new BadRequestException(BookErrors.NOT_UPDATED);

    return mapBookToResponse(book);
  }

  @Delete(':id')
  @Permissions(Roles.ADMIN)
  async deleteBook(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return await this.bookService.deleteBook(id);
  }
}
