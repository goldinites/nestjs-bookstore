import { Book } from '../entities/book.entity';

export type BookGetAllReqDto = {
  field?: keyof Book;
  direction?: 'ASC' | 'DESC';
  limit?: number;
  offset?: number;
};
