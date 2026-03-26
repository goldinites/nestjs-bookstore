import {
  BadRequestException,
  NotFoundException,
  Injectable,
} from '@nestjs/common';
import { Book } from './entities/book.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BookGetAllReqDto } from './dto/get-all.dto';
import { DeleteBookResDto } from './dto/delete.dto';
import { BookErrors } from './enums/errors.enum';
import { getAllBooksDefaults } from './constants/get-all.contants';

@Injectable()
export class BookService {
  constructor(
    @InjectRepository(Book)
    private bookRepository: Repository<Book>,
  ) {}

  async getList(params?: BookGetAllReqDto): Promise<Book[]> {
    const { field, direction, limit, offset } = {
      ...getAllBooksDefaults,
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

  async create(payload: Book): Promise<Book[]> {
    if (!payload) throw new BadRequestException(BookErrors.NOT_CREATED);

    await this.bookRepository.save(payload);

    return await this.getList();
  }

  async update(id: number, payload: Partial<Book>): Promise<Book | null> {
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
