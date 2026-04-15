import { Type, Transform } from 'class-transformer';
import {
  IsArray,
  IsIn,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import type { FindOptionsOrderValue } from 'typeorm';
import { toArray } from '@/modules/utils/to-array';

export const BOOK_SORT_FIELDS = [
  'id',
  'title',
  'author',
  'publishedYear',
  'genre',
  'language',
  'stockCount',
  'rating',
  'price',
  'createdAt',
  'purchasesCount',
] as const;

export type BookSortField = (typeof BOOK_SORT_FIELDS)[number];

export class GetBookReqDto {
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  id?: number;

  @IsOptional()
  @IsString()
  @Type(() => String)
  title?: string;

  @IsOptional()
  @IsString()
  @Type(() => String)
  author?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  publishedYearFrom?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  publishedYearTo?: number;

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
  @IsNumber()
  @Min(0)
  @Max(5)
  rating?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  priceFrom?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  priceTo?: number;

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
