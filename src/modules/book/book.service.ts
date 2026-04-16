import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Book } from '@/modules/book/entities/book.entity';
import {
  DataSource,
  FindOptionsSelect,
  FindOptionsWhere,
  ILike,
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
import { BOOKS_COUNT_PROPERTY } from '@/modules/category/constants/category.constants';

@Injectable()
export class BookService {
  private multiFieldsValue: string[] = ['genre', 'language'] as const;
  private rangeFieldsValue: string[] = ['price', 'publishedYear'] as const;

  constructor(
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,
    private readonly dataSource: DataSource,
  ) {}

  private searchBooks(whereProp: FindOptionsWhere<Book>, searchQuery?: string) {
    const queryValue = searchQuery?.trim();

    if (!queryValue) {
      return whereProp;
    }

    const searchWhere: FindOptionsWhere<Book>[] = [];

    searchWhere.push(
      { ...whereProp, title: ILike(`%${queryValue}%`) },
      { ...whereProp, author: ILike(`%${queryValue}%`) },
    );

    return searchWhere;
  }

  private prepareBooksFindWhere(query: GetBookReqDto) {
    const { q, ...rest } = query;

    const normalizedWhere = normalizeQuery<GetBookReqDto, Book>(rest, {
      multiFields: this.multiFieldsValue,
      rangeFields: this.rangeFieldsValue,
    });

    return this.searchBooks(normalizedWhere, q);
  }

  async getBooks(query?: GetBookReqDto, select?: FindOptionsSelect<Book>) {
    const { field, direction, limit, offset, ...rest } = {
      ...getBookDefaultParams,
      ...query,
    };

    const where = this.prepareBooksFindWhere(rest);

    return await this.bookRepository.findAndCount({
      where,
      order: { [field]: direction },
      take: limit,
      skip: offset,
      relations: { category: Boolean(select?.category) },
      select,
    });
  }

  async getBookById(id: number): Promise<Book | null> {
    return await this.bookRepository.findOneBy({ id });
  }

  async createBook(payload: CreateBookDto): Promise<Book> {
    return await this.dataSource.transaction(async (manager) => {
      const bookRepository = manager.getRepository(Book);
      const categoryRepository = manager.getRepository(Category);
      const { categoryId, ...rest } = payload;

      const category = await categoryRepository.findOneBy({ id: categoryId });

      if (!category) throw new NotFoundException(CategoryErrors.NOT_FOUND);

      const book = bookRepository.create({
        ...rest,
        category,
      });

      await manager.increment(
        Category,
        { id: categoryId },
        BOOKS_COUNT_PROPERTY,
        1,
      );

      return await bookRepository.save(book);
    });
  }

  async importBooks(payload: CreateBookDto[]): Promise<Book[]> {
    if (payload.length === 0) return [];

    return await this.dataSource.transaction(async (manager) => {
      const bookRepository = manager.getRepository(Book);
      const categoryRepository = manager.getRepository(Category);

      const categoryIds = [...new Set(payload.map((item) => item.categoryId))];

      const categories = await categoryRepository.find({
        where: categoryIds.map((id) => ({ id })),
      });

      const categoryMap = new Map(
        categories.map((category) => [category.id, category]),
      );

      const books = payload.map(({ categoryId, ...rest }) => {
        const category = categoryMap.get(categoryId);

        if (!category) throw new NotFoundException(CategoryErrors.NOT_FOUND);

        return bookRepository.create({
          ...rest,
          category,
        });
      });

      const booksCountByCategory = payload.reduce((acc, { categoryId }) => {
        acc.set(categoryId, (acc.get(categoryId) ?? 0) + 1);
        return acc;
      }, new Map<number, number>());

      await Promise.all(
        [...booksCountByCategory.entries()].map(([categoryId, count]) =>
          manager.increment(
            Category,
            { id: categoryId },
            BOOKS_COUNT_PROPERTY,
            count,
          ),
        ),
      );

      return await bookRepository.save(books);
    });
  }

  async updateBook(id: number, payload: UpdateBookDto): Promise<Book | null> {
    return await this.dataSource.transaction(async (manager) => {
      const bookRepository = manager.getRepository(Book);
      const categoryRepository = manager.getRepository(Category);

      const book: Book | null = await bookRepository.findOne({
        where: { id },
        relations: { category: true },
      });

      if (!book) throw new NotFoundException(BookErrors.NOT_FOUND);

      const { categoryId, ...rest } = payload;

      let category: Category | null = book.category;
      const previousCategoryId = book.category?.id;

      if (categoryId !== undefined) {
        category = await categoryRepository.findOneBy({ id: categoryId });

        if (!category) throw new NotFoundException(CategoryErrors.NOT_FOUND);
      }

      const { affected } = await bookRepository.update(id, {
        ...rest,
        category,
      });

      if (affected === 0) throw new BadRequestException(BookErrors.NOT_UPDATED);

      if (categoryId !== undefined && previousCategoryId !== category?.id) {
        if (previousCategoryId !== undefined) {
          await manager.decrement(
            Category,
            { id: previousCategoryId },
            BOOKS_COUNT_PROPERTY,
            1,
          );
        }

        if (category?.id !== undefined) {
          await manager.increment(
            Category,
            { id: category.id },
            BOOKS_COUNT_PROPERTY,
            1,
          );
        }
      }

      const updated: Book | null = await bookRepository.findOne({
        where: { id },
        relations: { category: true },
      });

      if (!updated) throw new NotFoundException(BookErrors.NOT_FOUND);

      return updated;
    });
  }

  async deleteBook(id: number): Promise<void> {
    await this.dataSource.transaction(async (manager) => {
      const bookRepository = manager.getRepository(Book);

      const book: Book | null = await bookRepository.findOne({
        where: { id },
        relations: { category: true },
      });

      if (!book) throw new NotFoundException(BookErrors.NOT_FOUND);

      if (book.category?.id !== undefined) {
        await manager.decrement(
          Category,
          { id: book.category.id },
          BOOKS_COUNT_PROPERTY,
          1,
        );
      }

      await bookRepository.remove(book);
    });
  }
}
