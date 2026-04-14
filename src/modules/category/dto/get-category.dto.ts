import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsIn,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import type { FindOptionsOrderValue } from 'typeorm';

export const CATEGORY_SORT_FIELDS = ['id', 'title'] as const;

export type CategorySortField = (typeof CATEGORY_SORT_FIELDS)[number];

export class GetCategoryReqDto {
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  id?: number;

  @IsOptional()
  @IsString()
  @Type(() => String)
  title?: string;

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

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  withBooks?: boolean;
}
