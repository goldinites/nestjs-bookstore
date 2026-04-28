import { BookResponse } from '@/modules/book/types/book.type';

export type OrderItemResponse = {
  id: number;
  title: string;
  price: number;
  quantity: number;
  book?: BookResponse;
};
