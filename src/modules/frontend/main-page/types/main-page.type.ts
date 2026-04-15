import { GetBooksResponse } from '@/modules/book/types/book.type';
import { GetCategoriesResponse } from '@/modules/category/types/category.type';

export type MainPageData = {
  banners?: unknown;
  newestBooks?: GetBooksResponse;
  popularCategories?: GetCategoriesResponse;
  popularBooks?: GetBooksResponse;
  discountedBooks?: GetBooksResponse;
  about?: string;
};
