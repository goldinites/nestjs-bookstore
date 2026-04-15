import { Injectable } from '@nestjs/common';
import { BookService } from '@/modules/book/book.service';
import { Book } from '@/modules/book/entities/book.entity';
import { MainPageData } from '@/modules/frontend/main-page/types/main-page.type';
import { mapBooksToResponse } from '@/modules/book/mappers/book-to-response.mapper';
import { BookResponse } from '@/modules/book/types/book.type';
import { CategoryResponse } from '@/modules/category/types/category.type';
import { CategoryService } from '@/modules/category/category.service';
import { mapCategoriesToResponse } from '@/modules/category/mappers/category-to-response.mapper';

@Injectable()
export class MainPageService {
  constructor(
    private bookService: BookService,
    private categoryService: CategoryService,
  ) {}
  async getNewestBooks(): Promise<BookResponse[]> {
    const books: Book[] = await this.bookService.getBooks({
      field: 'createdAt',
      direction: 'DESC',
    });

    return mapBooksToResponse(books);
  }

  async getPopularBooksCategories() {
    const categories = await this.categoryService.getCategories({
      field: 'booksCount',
      direction: 'DESC',
      limit: 10,
    });

    return mapCategoriesToResponse(categories);
  }

  async getPopularBooks(): Promise<BookResponse[]> {
    const books: Book[] = await this.bookService.getBooks({
      field: 'purchasesCount',
      direction: 'DESC',
    });

    return mapBooksToResponse(books);
  }

  async buildMainPageData(): Promise<MainPageData> {
    const newestBooks: BookResponse[] = await this.getNewestBooks();

    const popularCategories: CategoryResponse[] =
      await this.getPopularBooksCategories();

    const popularBooks: BookResponse[] = await this.getPopularBooks();

    return { newestBooks, popularCategories, popularBooks };
  }
}
