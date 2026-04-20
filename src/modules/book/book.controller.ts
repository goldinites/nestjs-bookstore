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
import {
  BookResponse,
  GetBooksResponse,
  ReviewResponse,
} from '@/modules/book/types/book.type';
import {
  mapBooksToResponse,
  mapBookToResponse,
  mapReviewToResponse,
} from '@/modules/book/mappers/book-to-response.mapper';
import { BookErrors } from '@/modules/book/enums/errors.enum';
import { FileService } from '@/modules/file/file.service';
import { UploadType } from '@/modules/file/enums/upload-type.enum';
import { FilesUploadInterceptor } from '@/modules/file/interceptors/file-upload.interceptor';
import { RequiredFilePipe } from '@/modules/file/pipes/required-file.pipe';
import { prepareFileMetadata } from '@/modules/file/utils/prepare-metadata.util';
import { CurrentUser } from '@/modules/auth/decorators/current-user.decorator';
import type { AuthUser } from '@/modules/auth/types/auth-user.type';
import { AddReviewDto } from '@/modules/book/dto/add-review.dto';
import { ReviewService } from '@/modules/book/services/review.service';
import { DeleteReviewDto } from '@/modules/book/dto/delete-review.dto';
import { UpdateReviewDto } from '@/modules/book/dto/update-review.dto';

@UseGuards(JwtAuthGuard, RolesGuard)
@Permissions(Roles.ADMIN)
@Controller('book')
export class BookController {
  constructor(
    private readonly bookService: BookService,
    private readonly reviewService: ReviewService,
    private readonly fileService: FileService,
  ) {}

  @Get()
  async getBooks(@Query() query: GetBookReqDto): Promise<GetBooksResponse> {
    const [content, total] = await this.bookService.getBooks(query);

    return { content: content, total };
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
  @UseInterceptors(
    FilesUploadInterceptor(UploadType.IMAGE, {
      fieldName: 'image',
      mode: 'single',
    }),
  )
  async createBook(
    @Body() payload: CreateBookDto,
    @UploadedFile(RequiredFilePipe())
    image: Express.Multer.File,
  ): Promise<BookResponse> {
    if (image) {
      this.fileService.saveMetadata(image.filename, prepareFileMetadata(image));

      payload.imageUrl = this.fileService.buildPublicUrl(image.filename);
    }

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
  @UseInterceptors(
    FilesUploadInterceptor(UploadType.IMAGE, {
      fieldName: 'image',
      mode: 'single',
    }),
  )
  async updateBook(
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: UpdateBookDto,
    @UploadedFile(RequiredFilePipe())
    image: Express.Multer.File,
  ): Promise<BookResponse> {
    if (image) {
      this.fileService.saveMetadata(image.filename, prepareFileMetadata(image));

      payload.imageUrl = this.fileService.buildPublicUrl(image.filename);
    }

    const book: Book | null = await this.bookService.updateBook(id, payload);

    if (!book) throw new BadRequestException(BookErrors.NOT_UPDATED);

    return mapBookToResponse(book);
  }

  @Delete(':id')
  async deleteBook(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return await this.bookService.deleteBook(id);
  }

  @Post(':id/review')
  async addReview(
    @CurrentUser() { userId }: AuthUser,
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: AddReviewDto,
  ): Promise<ReviewResponse> {
    const review = await this.reviewService.addReview(userId, id, payload);

    return mapReviewToResponse(review);
  }

  @Patch(':id/review')
  async updateReview(
    @CurrentUser() { userId }: AuthUser,
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: UpdateReviewDto,
  ) {
    const review = await this.reviewService.updateReview(userId, id, payload);

    return mapReviewToResponse(review);
  }

  @Delete(':id/review')
  async deleteReview(
    @CurrentUser() { userId }: AuthUser,
    @Param('id', ParseIntPipe) id: number,
    @Body() { reviewId }: DeleteReviewDto,
  ): Promise<void> {
    return await this.reviewService.deleteReview(userId, id, reviewId);
  }
}
