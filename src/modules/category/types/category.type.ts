import { BookResponse } from '@/modules/book/types/book.type';

export type CategoryResponse = {
  id: number;
  title: string;
  booksCount: number;
  description?: string;
  imageUrl?: string;
  books?: BookResponse[];
};

export type GetCategoriesResponse = {
  content: CategoryResponse[];
  total: number;
};
