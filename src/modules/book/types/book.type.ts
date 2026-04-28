import { CategoryResponse } from '@/modules/category/types/category.type';
import { FindOptionsRelations, FindOptionsSelect } from 'typeorm';
import { Book } from '@/modules/book/entities/book.entity';
import { UserResponse } from '@/modules/user/types/user.type';

export type GetBookOptions = {
  select?: FindOptionsSelect<Book>;
  relations?: FindOptionsRelations<Book>;
};

export type ReviewResponse = {
  id: number;
  isActive: boolean;
  text: string;
  rating: number;
  createdAt: Date;
  user?: UserResponse;
};

export type BookResponse = {
  id: number;
  isActive: boolean;
  title: string;
  description: string;
  imageUrl: string;
  author: string;
  publishedYear: number;
  genre: string;
  language: string;
  stockCount: number;
  rating: number;
  price: number;
  reviews?: ReviewResponse[];
  category?: CategoryResponse;
};

export type GetBooksResponse = {
  content: BookResponse[];
  total: number;
};
