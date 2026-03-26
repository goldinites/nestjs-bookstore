import { Book } from '../entities/book.entity';

export type CreateBookDto = Omit<Book, 'id'>;
