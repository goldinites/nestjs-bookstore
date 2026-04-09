import { BookResponse } from '@/modules/book/types/book.type';

export type BookCategory = {
  id: string;
  name: string;
  imageUrl: string;
};

export type MainPageData = {
  banners?: unknown;
  popularBooks?: BookResponse[];
  newestBooks?: BookResponse[];
  categories?: BookCategory[];
  discountedBooks?: BookResponse[];
  about?: string;
};
