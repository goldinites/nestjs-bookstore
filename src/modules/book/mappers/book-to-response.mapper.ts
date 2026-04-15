import { Book } from '@/modules/book/entities/book.entity';
import { BookResponse } from '@/modules/book/types/book.type';

export function mapBookToResponse(book: Book): BookResponse {
  return {
    id: book.id,
    title: book.title,
    author: book.author,
    genre: book.category.title,
    language: book.language,
    imageUrl: book.imageUrl,
    publishedYear: book.publishedYear,
    stockCount: book.stockCount,
    rating: Number(book.rating),
    price: Number(book.price),
  };
}

export function mapBooksToResponse(books: Book[]): BookResponse[] {
  return books.map(mapBookToResponse);
}
