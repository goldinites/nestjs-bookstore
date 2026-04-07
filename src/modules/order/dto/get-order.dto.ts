import { Type } from 'class-transformer';
import {
  IsEnum,
  IsIn,
  IsInt,
  IsNumber,
  IsOptional,
  Max,
  Min,
} from 'class-validator';
import type { FindOptionsOrderValue } from 'typeorm';
import { OrderStatus } from '@/modules/order/enums/status.enum';

export const ORDER_SORT_FIELDS: string[] = ['status', 'createdAt'] as const;

export type OrderSortField = (typeof ORDER_SORT_FIELDS)[number];

export class GetOrderReqDto {
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  id?: number;

  @IsOptional()
  @IsEnum(OrderStatus)
  status?: OrderStatus;

  @IsOptional()
  @IsIn(ORDER_SORT_FIELDS)
  field?: OrderSortField;

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
