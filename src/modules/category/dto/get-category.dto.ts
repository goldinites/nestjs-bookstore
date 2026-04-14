import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsIn,
  IsInt,
  IsNumber,
  IsOptional,
  Max,
  Min,
} from 'class-validator';
import type { FindOptionsOrderValue } from 'typeorm';
import { toArray } from '@/modules/utils/to-array';

export const CATEGORY_SORT_FIELDS = ['id', 'title', 'booksCount'] as const;

export type CategorySortField = (typeof CATEGORY_SORT_FIELDS)[number];

export class GetCategoryReqDto {
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  id?: number;

  @IsOptional()
  @Transform(({ value }) => toArray(value)?.map(String))
  @Type(() => String)
  @IsArray()
  title?: string;

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  withBooks?: boolean;

  @IsOptional()
  @IsIn(CATEGORY_SORT_FIELDS)
  field?: CategorySortField;

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
