import {
  BadRequestException,
  NotFoundException,
  Injectable,
} from '@nestjs/common';
import { Book } from './entities/book.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GetListBookReqDto } from './dto/get-list-book.dto';
import { DeleteBookResDto } from './dto/delete-book.dto';
import { BookErrors } from './enums/errors.enum';
import { getListBooksDefaultParams } from './constants/get-list-book.constants';
import type { CreateBookDto } from './dto/create-book.dto';
import type { UpdateBookDto } from './dto/update-book.dto';

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

  async find(id: number): Promise<Book | null> {
    if (!id) throw new NotFoundException(BookErrors.NOT_FOUND);

    return await this.bookRepository.findOneBy({ id });
  }

  async create(payload: CreateBookDto): Promise<Book> {
    if (!payload) throw new BadRequestException(BookErrors.NOT_CREATED);

    return await this.bookRepository.save(payload);
  }

  async update(id: number, payload: UpdateBookDto): Promise<Book | null> {
    if (!id) throw new NotFoundException(BookErrors.NOT_FOUND);

    const updated = await this.bookRepository.update(id, payload);

    if (updated.affected === 0)
      throw new BadRequestException(BookErrors.NOT_UPDATED);

    return await this.find(id);
  }

  async delete(id: number): Promise<DeleteBookResDto> {
    if (!id) throw new NotFoundException(BookErrors.NOT_FOUND);

    const { affected } = await this.bookRepository.delete(id);

    if (!affected) throw new BadRequestException(BookErrors.NOT_DELETED);

    return { success: affected > 0 };
  }
}
