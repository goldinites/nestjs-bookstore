import { Book } from '@/modules/book/entities/book.entity';
import { BookResponse, ReviewResponse } from '@/modules/book/types/book.type';
import { Review } from '@/modules/book/entities/review.entity';

export function mapReviewToResponse(review: Review): ReviewResponse {
  const user = review.user
    ? { id: review.user.id, email: review.user.email }
    : undefined;

  return {
    id: review.id,
    text: review.text,
    rating: review.rating,
    createdAt: review.createdAt,
    user,
  };
}

export function mapReviewsToResponse(reviews: Review[]): ReviewResponse[] {
  return reviews.map(mapReviewToResponse);
}

export function mapBookToResponse(book: Book): BookResponse {
  const reviews = book.reviews ? mapReviewsToResponse(book.reviews) : undefined;

  return {
    id: book.id,
    title: book.title,
    author: book.author,
    language: book.language,
    genre: book.genre,
    imageUrl: book.imageUrl,
    publishedYear: book.publishedYear,
    stockCount: book.stockCount,
    rating: Number(book.rating),
    price: Number(book.price),
    description: book.description,
    reviews,
  };
}

export function mapBooksToResponse(books: Book[]): BookResponse[] {
  return books.map(mapBookToResponse);
}
