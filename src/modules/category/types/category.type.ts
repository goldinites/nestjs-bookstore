import { BookResponse } from '@/modules/book/types/book.type';
import { FindOptionsRelations, FindOptionsSelect } from 'typeorm';
import { Category } from '@/modules/category/entities/category.entity';

export type GetCategoryOptions = {
  select?: FindOptionsSelect<Category>;
  relations?: FindOptionsRelations<Category>;
};

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
