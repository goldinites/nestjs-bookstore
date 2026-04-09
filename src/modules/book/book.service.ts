import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Book } from '@/modules/book/entities/book.entity';
import { Repository } from 'typeorm';
import { GetBookReqDto } from '@/modules/book/dto/get-book.dto';
import { getBookDefaultParams } from '@/modules/book/constants/get-book.constants';
import { BookErrors } from '@/modules/book/enums/errors.enum';
import { CreateBookDto } from '@/modules/book/dto/create-book.dto';
import { UpdateBookDto } from '@/modules/book/dto/update-book.dto';
import { normalizeQuery } from '@/modules/utils/query/normalize-query';

@Injectable()
export class BookService {
  private multiFieldsValue: string[] = ['genre', 'language'] as const;
  private rangeFieldsValue: string[] = ['price', 'publishedYear'] as const;

  constructor(
    @InjectRepository(Book)
    private bookRepository: Repository<Book>,
  ) {}

  async getBooks(query?: GetBookReqDto): Promise<Book[]> {
    const { field, direction, limit, offset, ...rest } = {
      ...getBookDefaultParams,
      ...query,
    };

    const where = normalizeQuery(rest, {
      multiFields: this.multiFieldsValue,
      rangeFields: this.rangeFieldsValue,
    });

    return await this.bookRepository.find({
      where,
      order: { [field]: direction },
      take: limit,
      skip: offset,
    });
  }

  async getBookById(id: number): Promise<Book | null> {
    return await this.bookRepository.findOneBy({ id });
  }

  async createBook(payload: CreateBookDto): Promise<Book> {
    const book: Book | null = this.bookRepository.create(payload);

    return await this.bookRepository.save(book);
  }

  async importBooks(payload: CreateBookDto[]): Promise<Book[]> {
    const books: Book[] = this.bookRepository.create(payload);

    if (books.length === 0) return [];

    return await this.bookRepository.save(books);
  }

  async updateBook(id: number, payload: UpdateBookDto): Promise<Book | null> {
    const book: Book | null = await this.getBookById(id);

    if (!book) throw new NotFoundException(BookErrors.NOT_FOUND);

    const { affected } = await this.bookRepository.update(id, payload);

    if (affected === 0) throw new BadRequestException(BookErrors.NOT_UPDATED);

    const updated: Book | null = await this.getBookById(id);

    if (!updated) throw new NotFoundException(BookErrors.NOT_FOUND);

    return updated;
  }

  async updateBookImage(id: number, imageUrl: string): Promise<Book | null> {
    const book: Book | null = await this.getBookById(id);

    if (!book) throw new NotFoundException(BookErrors.NOT_FOUND);

    const { affected } = await this.bookRepository.update(id, { imageUrl });

    if (affected === 0) throw new BadRequestException(BookErrors.NOT_UPDATED);

    const updated: Book | null = await this.getBookById(id);

    if (!updated) throw new NotFoundException(BookErrors.NOT_FOUND);

    return updated;
  }

  async deleteBook(id: number): Promise<void> {
    const book: Book | null = await this.getBookById(id);

    if (!book) throw new NotFoundException(BookErrors.NOT_FOUND);

    await this.bookRepository.remove(book);
  }
}
