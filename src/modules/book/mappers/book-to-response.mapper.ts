import { Book } from '@/modules/book/entities/book.entity';
import { BookResponse, ReviewResponse } from '@/modules/book/types/book.type';
import { Review } from '@/modules/book/entities/review.entity';
import { mapCategoryToResponse } from '@/modules/category/mappers/category-to-response.mapper';

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

function filterActiveReviews(reviews: Review[]): Review[] {
  return reviews.filter((review) => review.isActive);
}

export function mapReviewsToResponse(reviews: Review[]): ReviewResponse[] {
  return filterActiveReviews(reviews).map(mapReviewToResponse);
}

export function mapBookToResponse(book: Book): BookResponse {
  const reviews = book.reviews ? mapReviewsToResponse(book.reviews) : undefined;
  const category = book.category
    ? mapCategoryToResponse(book.category)
    : undefined;

  return {
    id: book.id,
    isActive: book.isActive,
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
    category,
  };
}

export function mapBooksToResponse(books: Book[]): BookResponse[] {
  return books.map(mapBookToResponse);
}
