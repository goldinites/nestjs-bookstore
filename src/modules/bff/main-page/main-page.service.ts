import { Injectable } from '@nestjs/common';
import { BookService } from '@/modules/book/book.service';
import { MainPageData } from '@/modules/bff/main-page/types/main-page.type';
import { mapBooksToResponse } from '@/modules/book/mappers/book-to-response.mapper';
import { BookResponse } from '@/modules/book/types/book.type';
import { CategoryResponse } from '@/modules/category/types/category.type';
import { CategoryService } from '@/modules/category/category.service';
import { mapCategoriesToResponse } from '@/modules/category/mappers/category-to-response.mapper';

@Injectable()
export class MainPageService {
  constructor(
    private readonly bookService: BookService,
    private readonly categoryService: CategoryService,
  ) {}
  private async getNewestBooks(): Promise<BookResponse[]> {
    const { content } = await this.bookService.getBooks({
      field: 'createdAt',
      direction: 'DESC',
      limit: 10,
    });

    return mapBooksToResponse(content);
  }

  private async getPopularBooksCategories(): Promise<CategoryResponse[]> {
    const { content } = await this.categoryService.getCategories({
      field: 'booksCount',
      direction: 'DESC',
      limit: 10,
    });

    return mapCategoriesToResponse(content);
  }

  private async getPopularBooks(): Promise<BookResponse[]> {
    const { content } = await this.bookService.getBooks({
      field: 'purchasesCount',
      direction: 'DESC',
      limit: 10,
    });

    return mapBooksToResponse(content);
  }

  async buildMainPageData(): Promise<MainPageData> {
    const newestBooks: BookResponse[] = await this.getNewestBooks();

    const popularCategories: CategoryResponse[] =
      await this.getPopularBooksCategories();

    const popularBooks: BookResponse[] = await this.getPopularBooks();

    return { newestBooks, popularCategories, popularBooks };
  }
}
