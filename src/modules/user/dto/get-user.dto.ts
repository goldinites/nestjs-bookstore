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
import { Roles } from '@/modules/user/enums/roles.enum';
import type { FindOptionsOrderValue } from 'typeorm';

export const USER_SORT_FIELDS = [
  'id',
  'firstName',
  'lastName',
  'email',
] as const;

export type UserSortField = (typeof USER_SORT_FIELDS)[number];

export class GetUserReqDto {
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  id?: number;

  @IsOptional()
  @Type(() => String)
  email?: string;

  @IsOptional()
  @Type(() => String)
  firstName?: string;

  @IsOptional()
  @Type(() => String)
  lastName?: string;

  @IsOptional()
  @IsEnum(Roles)
  role?: Roles;

  @IsOptional()
  @IsIn(USER_SORT_FIELDS)
  field?: UserSortField;

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
