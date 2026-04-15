import { BookResponse } from '@/modules/book/types/book.type';
import { CategoryResponse } from '@/modules/category/types/category.type';

export type MainPageData = {
  banners?: unknown;
  newestBooks?: BookResponse[];
  popularCategories?: CategoryResponse[];
  popularBooks?: BookResponse[];
  discountedBooks?: BookResponse[];
  about?: string;
};
