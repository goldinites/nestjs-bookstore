import { Injectable } from '@nestjs/common';
import { BookService } from '@/modules/book/book.service';
import { Book } from '@/modules/book/entities/book.entity';
import { MainPageData } from '@/modules/frontend/main-page/types/main-page.type';
import { mapBooksToResponse } from '@/modules/book/mappers/book-to-response.mapper';
import { BookResponse } from '@/modules/book/types/book.type';

@Injectable()
export class MainPageService {
  constructor(private bookService: BookService) {}
  async getNewestBooks(): Promise<BookResponse[]> {
    const books: Book[] = await this.bookService.getBooks({
      field: 'createdAt',
      direction: 'DESC',
      limit: 10,
    });

    return mapBooksToResponse(books);
  }

  // async getBooksCategories(): Promise<BookCategory[]> {
  //   const books: Book[] = await this.bookService.getBooks(
  //     { limit: 10 },
  //     {
  //       genre: true,
  //     },
  //   );
  //
  //   if (books.length === 0) return [];
  //
  //   // const genreNames: string[] = [...new Set(books.map((book) => book.genre))];
  //
  //   return genreNames.map((genre) => ({
  //     id: genre.toLowerCase().replaceAll(' ', '-'),
  //     name: genre,
  //     imageUrl: '',
  //   }));
  // }

  async buildMainPageData(): Promise<MainPageData> {
    const newestBooks: BookResponse[] = await this.getNewestBooks();
    // const categories: BookCategory[] = await this.getBooksCategories();

    return { newestBooks };
  }
}
