import { BookResponse } from '@/modules/book/types/book.type';

export type CategoryResponse = {
  id: number;
  title: string;
  description?: string;
  imageUrl?: string;
  books?: BookResponse[];
};
