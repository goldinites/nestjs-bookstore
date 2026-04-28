import { CategoryResponse } from '@/modules/category/types/category.type';

export type ReviewResponse = {
  id: number;
  text: string;
  rating: number;
  createdAt: Date;
  user?: {
    id: number;
    email: string;
  };
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
