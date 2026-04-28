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
import { prepareFileMetadata } from '@/modules/file/utils/prepare-metadata.util';
import { CurrentUser } from '@/modules/auth/decorators/current-user.decorator';
import type { AuthUser } from '@/modules/auth/types/auth-user.type';
import { AddReviewDto } from '@/modules/book/dto/add-review.dto';
import { ReviewService } from '@/modules/book/services/review.service';
import { UpdateReviewDto } from '@/modules/book/dto/update-review.dto';
import { ToggleIsActiveReviewDto } from '@/modules/book/dto/toggle-is-active-review.dto';
import { ToggleIsActiveBookDto } from '@/modules/book/dto/toggle-is-active-book.dto';

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

    return { content: mapBooksToResponse(content), total };
  }

  @Get(':id')
  async getBookById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<BookResponse> {
    const book: Book | null = await this.bookService.getBookById(id, {
      category: true,
      reviews: true,
    });

    if (!book) throw new NotFoundException(BookErrors.NOT_FOUND);

    return mapBookToResponse(book);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Permissions(Roles.ADMIN)
  @Post()
  @UseInterceptors(
    FilesUploadInterceptor(UploadType.IMAGE, {
      fieldName: 'image',
      mode: 'single',
    }),
  )
  async createBook(
    @Body() payload: CreateBookDto,
    @UploadedFile()
    image: Express.Multer.File,
  ): Promise<BookResponse> {
    const bookPayload: CreateBookDto = { ...payload };

    if (image) {
      this.fileService.saveMetadata(image.filename, prepareFileMetadata(image));

      bookPayload.imageUrl = this.fileService.buildPublicUrl(image.filename);
    }

    const book: Book = await this.bookService.createBook(bookPayload);

    return mapBookToResponse(book);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Permissions(Roles.ADMIN)
  @Patch(':bookId/toggle')
  async toggleIsActiveBook(
    @Param('bookId', ParseIntPipe) bookId: number,
    @Body() payload: ToggleIsActiveBookDto,
  ): Promise<BookResponse> {
    const book = await this.bookService.toggleIsActiveBook(bookId, payload);

    return mapBookToResponse(book);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Permissions(Roles.ADMIN)
  @Post('import')
  async importBooks(
    @Body(new ParseArrayPipe({ items: CreateBookDto }))
    payload: CreateBookDto[],
  ): Promise<BookResponse[]> {
    const books: Book[] = await this.bookService.importBooks(payload);

    return mapBooksToResponse(books);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Permissions(Roles.ADMIN)
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
    @UploadedFile()
    image: Express.Multer.File,
  ): Promise<BookResponse> {
    const bookPayload: UpdateBookDto = { ...payload };

    if (image) {
      this.fileService.saveMetadata(image.filename, prepareFileMetadata(image));

      bookPayload.imageUrl = this.fileService.buildPublicUrl(image.filename);
    }

    const book: Book | null = await this.bookService.updateBook(
      id,
      bookPayload,
    );

    if (!book) throw new BadRequestException(BookErrors.NOT_UPDATED);

    return mapBookToResponse(book);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Permissions(Roles.ADMIN)
  @Delete(':id')
  async deleteBook(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return await this.bookService.deleteBook(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':bookId/review')
  async addReview(
    @CurrentUser() { userId }: AuthUser,
    @Param('bookId', ParseIntPipe) bookId: number,
    @Body() payload: AddReviewDto,
  ): Promise<ReviewResponse> {
    const review = await this.reviewService.addReview(userId, bookId, payload);

    return mapReviewToResponse(review);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Permissions(Roles.ADMIN)
  @Patch(':bookId/review/:reviewId/toggle')
  async toggleIsActiveReview(
    @Param('bookId', ParseIntPipe) bookId: number,
    @Param('reviewId', ParseIntPipe) reviewId: number,
    @Body() payload: ToggleIsActiveReviewDto,
  ): Promise<ReviewResponse> {
    const review = await this.reviewService.toggleIsActiveReview(
      bookId,
      reviewId,
      payload,
    );

    return mapReviewToResponse(review);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':bookId/review/:reviewId')
  async updateReview(
    @CurrentUser() { userId }: AuthUser,
    @Param('bookId', ParseIntPipe) bookId: number,
    @Param('reviewId', ParseIntPipe) reviewId: number,
    @Body() payload: UpdateReviewDto,
  ): Promise<ReviewResponse> {
    const review = await this.reviewService.updateReview(
      userId,
      bookId,
      reviewId,
      payload,
    );

    return mapReviewToResponse(review);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':bookId/review/:reviewId')
  async deleteReview(
    @CurrentUser() user: AuthUser,
    @Param('bookId', ParseIntPipe) bookId: number,
    @Param('reviewId', ParseIntPipe) reviewId: number,
  ): Promise<void> {
    return await this.reviewService.deleteReview(user, bookId, reviewId);
  }
}
