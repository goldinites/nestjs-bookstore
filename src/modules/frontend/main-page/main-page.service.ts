import { Injectable } from '@nestjs/common';
import { BookService } from '@/modules/book/book.service';
import { MainPageData } from '@/modules/frontend/main-page/types/main-page.type';
import { mapBooksToResponse } from '@/modules/book/mappers/book-to-response.mapper';
import { GetBooksResponse } from '@/modules/book/types/book.type';
import { GetCategoriesResponse } from '@/modules/category/types/category.type';
import { CategoryService } from '@/modules/category/category.service';
import { mapCategoriesToResponse } from '@/modules/category/mappers/category-to-response.mapper';

@Injectable()
export class MainPageService {
  constructor(
    private readonly bookService: BookService,
    private readonly categoryService: CategoryService,
  ) {}
  async getNewestBooks(): Promise<GetBooksResponse> {
    const { content, total } = await this.bookService.getBooks({
      field: 'createdAt',
      direction: 'DESC',
      limit: 10,
    });

    return { content: mapBooksToResponse(content), total };
  }

  async getPopularBooksCategories(): Promise<GetCategoriesResponse> {
    const { content, total } = await this.categoryService.getCategories({
      field: 'booksCount',
      direction: 'DESC',
      limit: 10,
    });

    return { content: mapCategoriesToResponse(content), total };
  }

  async getPopularBooks(): Promise<GetBooksResponse> {
    const { content, total } = await this.bookService.getBooks({
      field: 'purchasesCount',
      direction: 'DESC',
      limit: 10,
    });

    return { content: mapBooksToResponse(content), total };
  }

  async buildMainPageData(): Promise<MainPageData> {
    const newestBooks: GetBooksResponse = await this.getNewestBooks();

    const popularCategories: GetCategoriesResponse =
      await this.getPopularBooksCategories();

    const popularBooks: GetBooksResponse = await this.getPopularBooks();

    return { newestBooks, popularCategories, popularBooks };
  }
}
