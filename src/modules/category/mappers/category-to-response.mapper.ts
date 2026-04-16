import { Category } from '@/modules/category/entities/category.entity';
import { CategoryResponse } from '@/modules/category/types/category.type';
import { mapBooksToResponse } from '@/modules/book/mappers/book-to-response.mapper';

export function mapCategoryToResponse(category: Category): CategoryResponse {
  const books = category.books
    ? mapBooksToResponse(category?.books ?? [])
    : undefined;

  return {
    id: category.id,
    title: category.title,
    description: category.description,
    imageUrl: category.imageUrl,
    booksCount: category.booksCount,
    books,
  };
}

export function mapCategoriesToResponse(
  categories: Category[],
): CategoryResponse[] {
  return categories.map(mapCategoryToResponse);
}
