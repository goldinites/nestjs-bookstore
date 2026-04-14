import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseArrayPipe,
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
import { UploadType } from '@/modules/file/enums/upload-type.enum';
import { FilesUploadInterceptor } from '@/modules/file/interceptors/file-upload.interceptor';
import { RequiredFilePipe } from '@/modules/file/pipes/required-file.pipe';
import { prepareFileMetadata } from '@/modules/file/utils/prepare-metadata.util';

@UseGuards(JwtAuthGuard, RolesGuard)
@Permissions(Roles.ADMIN)
@Controller('book')
export class BookController {
  constructor(
    private readonly bookService: BookService,
    private readonly fileService: FileService,
  ) {}

  @Get()
  async getBooks(@Query() query: GetBookReqDto): Promise<BookResponse[]> {
    const books: Book[] = await this.bookService.getBooks(query);

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
  async createBook(@Body() payload: CreateBookDto): Promise<BookResponse> {
    const book: Book = await this.bookService.createBook(payload);

    return mapBookToResponse(book);
  }

  @Post('import')
  async importBooks(
    @Body(new ParseArrayPipe({ items: CreateBookDto }))
    payload: CreateBookDto[],
  ): Promise<BookResponse[]> {
    const books: Book[] = await this.bookService.importBooks(payload);

    return mapBooksToResponse(books);
  }

  @Patch(':id')
  async updateBook(
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: UpdateBookDto,
  ): Promise<BookResponse> {
    const book: Book | null = await this.bookService.updateBook(id, payload);

    if (!book) throw new BadRequestException(BookErrors.NOT_UPDATED);

    return mapBookToResponse(book);
  }

  @Patch(':id/image')
  @UseInterceptors(
    FilesUploadInterceptor(UploadType.IMAGE, {
      fieldName: 'image',
      mode: 'single',
    }),
  )
  async updateBookImage(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile(RequiredFilePipe())
    image: Express.Multer.File,
  ): Promise<BookResponse> {
    if (!image) throw new BadRequestException(BookErrors.IMAGE_REQUIRED);

    this.fileService.saveMetadata(image.filename, prepareFileMetadata(image));

    const imageUrl = this.fileService.buildPublicUrl(image.filename);

    const book: Book | null = await this.bookService.updateBook(id, {
      imageUrl,
    });

    if (!book) throw new BadRequestException(BookErrors.NOT_UPDATED);

    return mapBookToResponse(book);
  }

  @Delete(':id')
  async deleteBook(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return await this.bookService.deleteBook(id);
  }
}
