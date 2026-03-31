import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Book } from '@/modules/book/entities/book.entity';
import { Repository } from 'typeorm';
import { GetBookReqDto } from '@/modules/book/dto/get-book.dto';
import { getBookDefaultParams } from '@/modules/book/constants/get-book.constants';
import { BookErrors } from '@/modules/book/enums/errors.enum';
import { CreateBookDto } from '@/modules/book/dto/create-book.dto';
import { UpdateBookDto } from '@/modules/book/dto/update-book.dto';
import { DeleteBookResponse } from '@/modules/book/types/delete-book.type';

@Injectable()
export class BookService {
  constructor(
    @InjectRepository(Book)
    private bookRepository: Repository<Book>,
  ) {}

  async find(query?: GetBookReqDto): Promise<Book[]> {
    const { field, direction, limit, offset, ...where } = {
      ...getBookDefaultParams,
      ...query,
    };

    return await this.bookRepository.find({
      where,
      order: { [field]: direction },
      take: limit,
      skip: offset,
    });
  }

  async findOne(query?: GetBookReqDto): Promise<Book | null> {
    const books: Book[] = await this.find(query);

    return books[0] ?? null;
  }

  async create(payload: CreateBookDto): Promise<Book> {
    const book: Book | null = this.bookRepository.create(payload);

    if (!book) throw new BadRequestException(BookErrors.NOT_CREATED);

    return await this.bookRepository.save(book);
  }

  async import(payload: CreateBookDto[]): Promise<Book[]> {
    const books: Book[] = this.bookRepository.create(payload);

    if (books.length === 0) return [];

    return await this.bookRepository.save(books);
  }

  async update(id: number, payload: UpdateBookDto): Promise<Book | null> {
    await this.findOne({ id });

    const { affected } = await this.bookRepository.update(id, payload);

    if (affected === 0) throw new BadRequestException(BookErrors.NOT_UPDATED);

    return await this.findOne({ id });
  }

  async delete(id: number): Promise<DeleteBookResponse> {
    await this.findOne({ id });

    const { affected } = await this.bookRepository.delete(id);

    if (!affected) throw new BadRequestException(BookErrors.NOT_DELETED);

    return { success: true };
  }
}
