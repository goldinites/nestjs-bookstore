import { Type, Transform } from 'class-transformer';
import { IsArray, IsIn, IsInt, IsOptional, Max, Min } from 'class-validator';
import type { FindOptionsOrderValue } from 'typeorm';
import { toArray } from '@/modules/utils/to-array';

export const BOOK_SORT_FIELDS: string[] = [
  'id',
  'title',
  'author',
  'publishedYear',
  'genre',
  'language',
  'stockCount',
  'rating',
  'price',
] as const;

export type BookSortField = (typeof BOOK_SORT_FIELDS)[number];

export class GetBookReqDto {
  @IsOptional()
  @Type(() => Number)
  id?: number;

  @IsOptional()
  @Type(() => String)
  title?: string;

  @IsOptional()
  @Type(() => String)
  author?: string;

  @IsOptional()
  @Transform(({ value }) => toArray(value)?.map(Number))
  @IsArray()
  @Type(() => Number)
  @IsInt({ each: true })
  publishedYear?: number[];

  @IsOptional()
  @Transform(({ value }) => toArray(value)?.map(String))
  @Type(() => String)
  @IsArray()
  genre?: string[];

  @IsOptional()
  @Transform(({ value }) => toArray(value)?.map(String))
  @Type(() => String)
  @IsArray()
  language?: string[];

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Max(5)
  rating?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  price?: number;

  @IsOptional()
  @IsIn(BOOK_SORT_FIELDS)
  field?: BookSortField;

  @IsOptional()
  @IsIn(['ASC', 'DESC'])
  direction?: FindOptionsOrderValue;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  offset?: number;
}
