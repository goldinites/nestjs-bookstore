import { BookResponse } from '@/modules/book/types/book.type';
import { CategoryResponse } from '@/modules/category/types/category.type';

export type MainPageData = {
  banners?: unknown;
  popularBooks?: BookResponse[];
  newestBooks?: BookResponse[];
  categories?: CategoryResponse[];
  discountedBooks?: BookResponse[];
  about?: string;
};
