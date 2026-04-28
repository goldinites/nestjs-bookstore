import { BookResponse } from '@/modules/book/types/book.type';

export type CartItemResponse = {
  id: number;
  quantity: number;
  book?: BookResponse;
};
