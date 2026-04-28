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
  'rating',
  'price',
  'createdAt',
  'purchasesCount',
  'publishedYear',
] as const;

export type BookSortField = (typeof BOOK_SORT_FIELDS)[number];

export class GetBookReqDto {
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  id?: number;

  @IsString()
  @IsOptional()
  @Type(() => String)
  q?: string;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  publishedYearFrom?: number;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  publishedYearTo?: number;

  @IsArray()
  @IsOptional()
  @Type(() => String)
  @Transform(({ value }) => toArray(value)?.map(String))
  genre?: string[];

  @IsArray()
  @IsOptional()
  @Type(() => String)
  @Transform(({ value }) => toArray(value)?.map(String))
  language?: string[];

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(5)
  rating?: number;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  priceFrom?: number;

  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  priceTo?: number;

  @IsIn(BOOK_SORT_FIELDS)
  @IsOptional()
  field?: BookSortField;

  @IsIn(['ASC', 'DESC'])
  @IsOptional()
  direction?: FindOptionsOrderValue;

  @IsInt()
  @Type(() => Number)
  @IsOptional()
  @Min(1)
  @Max(100)
  limit?: number;

  @IsInt()
  @Type(() => Number)
  @IsOptional()
  @Min(0)
  offset?: number;
}
