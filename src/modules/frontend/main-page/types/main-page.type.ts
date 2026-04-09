import { BookResponse } from '@/modules/book/types/book.type';

export type BookGenre = {
  id: string;
  name: string;
};

export type MainPageData = {
  newestBooks: BookResponse[];
  genres: BookGenre[];
};
