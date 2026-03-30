import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Book } from '@/modules/book/entities/book.entity';
import { Repository } from 'typeorm';
import { GetListBookReqDto } from '@/modules/book/dto/get-list-book.dto';
import { getListBooksDefaultParams } from '@/modules/book/constants/get-list-book.constants';
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

  async getList(params?: GetListBookReqDto): Promise<Book[]> {
    const { field, direction, limit, offset } = {
      ...getListBooksDefaultParams,
      ...params,
    };

    return await this.bookRepository.find({
      order: { [field]: direction },
      take: limit,
      skip: offset,
    });
  }

  async find(id: number): Promise<Book> {
    const book: Book | null = await this.bookRepository.findOneBy({ id });

    if (!book) throw new NotFoundException(BookErrors.NOT_FOUND);

    return book;
  }

  async create(payload: CreateBookDto): Promise<Book> {
    const book: Book = this.bookRepository.create(payload);

    if (!book) throw new BadRequestException(BookErrors.NOT_CREATED);

    return await this.bookRepository.save(book);
  }

  async import(payload: CreateBookDto[]): Promise<Book[]> {
    const books: Book[] = this.bookRepository.create(payload);

    if (books.length === 0) return [];

    return await this.bookRepository.save(books);
  }

  async update(id: number, payload: UpdateBookDto): Promise<Book> {
    await this.find(id);

    const { affected } = await this.bookRepository.update(id, payload);

    if (affected === 0) throw new BadRequestException(BookErrors.NOT_UPDATED);

    return await this.find(id);
  }

  async delete(id: number): Promise<DeleteBookResponse> {
    await this.find(id);

    const { affected } = await this.bookRepository.delete(id);

    if (!affected) throw new BadRequestException(BookErrors.NOT_DELETED);

    return { success: true };
  }
}
