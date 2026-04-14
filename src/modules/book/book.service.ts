import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Book } from '@/modules/book/entities/book.entity';
import {
  FindOptionsSelect,
  FindOptionsWhere,
  ILike,
  In,
  Repository,
} from 'typeorm';
import { GetBookReqDto } from '@/modules/book/dto/get-book.dto';
import { getBookDefaultParams } from '@/modules/book/constants/get-book.constants';
import { BookErrors } from '@/modules/book/enums/errors.enum';
import { CreateBookDto } from '@/modules/book/dto/create-book.dto';
import { UpdateBookDto } from '@/modules/book/dto/update-book.dto';
import { normalizeQuery } from '@/modules/utils/query/normalize-query';
import { Category } from '@/modules/category/entities/category.entity';
import { CategoryErrors } from '@/modules/category/enums/errors.enum';

@Injectable()
export class BookService {
  private multiFieldsValue: string[] = ['language'] as const;
  private rangeFieldsValue: string[] = ['price', 'publishedYear'] as const;

  constructor(
    @InjectRepository(Book)
    private bookRepository: Repository<Book>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async getBooks(
    query?: GetBookReqDto,
    select?: FindOptionsSelect<Book>,
  ): Promise<Book[]> {
    const { field, direction, limit, offset, ...rest } = {
      ...getBookDefaultParams,
      ...query,
    };

    const where = this.prepareBookFindWhere(rest);

    return await this.bookRepository.find({
      where,
      order: { [field]: direction },
      take: limit,
      skip: offset,
      select,
      relations: { category: true },
    });
  }

  private prepareBookFindWhere(query: GetBookReqDto): FindOptionsWhere<Book>[] {
    const { genre, ...rest } = query;

    const normalized = normalizeQuery<GetBookReqDto, Book>(rest, {
      multiFields: this.multiFieldsValue,
      rangeFields: this.rangeFieldsValue,
    });

    return genre?.length
      ? genre.map((title) => ({
          ...normalized,
          category: {
            title: ILike(`%${title}%`),
          },
        }))
      : [normalized];
  }

  async getBookById(id: number): Promise<Book | null> {
    return await this.bookRepository.findOneBy({ id });
  }

  async createBook(payload: CreateBookDto): Promise<Book> {
    const { categoryId, ...rest } = payload;

    const category = await this.categoryRepository.findOneBy({
      id: categoryId,
    });

    if (!category) throw new NotFoundException(CategoryErrors.NOT_FOUND);

    const book = this.bookRepository.create({
      ...rest,
      category,
    });

    return await this.bookRepository.save(book);
  }

  async importBooks(payload: CreateBookDto[]): Promise<Book[]> {
    if (payload.length === 0) return [];

    const categoryIds = [...new Set(payload.map((item) => item.categoryId))];
    const categories = await this.categoryRepository.findBy({
      id: In(categoryIds),
    });

    const categoryMap = new Map(
      categories.map((category) => [category.id, category]),
    );

    const books = payload.map(({ categoryId, ...rest }) => {
      const category = categoryMap.get(categoryId);

      if (!category) throw new NotFoundException(CategoryErrors.NOT_FOUND);

      return this.bookRepository.create({
        ...rest,
        category,
      });
    });

    return await this.bookRepository.save(books);
  }

  async updateBook(id: number, payload: UpdateBookDto): Promise<Book | null> {
    const book: Book | null = await this.getBookById(id);

    if (!book) throw new NotFoundException(BookErrors.NOT_FOUND);

    const { categoryId, ...rest } = payload;

    let category: Category | null = book.category;

    if (categoryId !== undefined) {
      category = await this.categoryRepository.findOneBy({ id: categoryId });

      if (!category) throw new NotFoundException(CategoryErrors.NOT_FOUND);
    }

    const result = await this.bookRepository.update(id, {
      ...rest,
      category,
    });

    if (result.affected === 0)
      throw new BadRequestException(BookErrors.NOT_UPDATED);

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
