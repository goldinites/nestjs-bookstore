import { Type } from 'class-transformer';
import {
  IsInt,
  IsNumber,
  IsPositive,
  IsString,
  Min,
  Max,
  IsOptional,
  IsBoolean,
} from 'class-validator';

export class CreateBookDto {
  @IsBoolean()
  @IsOptional()
  @Type(() => Boolean)
  isActive?: boolean;

  @IsString()
  @Type(() => String)
  title: string;

  @IsString()
  @IsOptional()
  @Type(() => String)
  description?: string;

  @IsString()
  @IsOptional()
  @Type(() => String)
  imageUrl?: string;

  @IsString()
  @Type(() => String)
  author: string;

  @IsString()
  @Type(() => String)
  genre: string;

  @IsInt()
  @Type(() => Number)
  @IsPositive()
  categoryId: number;

  @IsInt()
  @Type(() => Number)
  @Min(0)
  @Max(9999)
  publishedYear: number;

  @IsString()
  @Type(() => String)
  language: string;

  @IsInt()
  @Type(() => Number)
  @IsOptional()
  @Min(0)
  stockCount?: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Type(() => Number)
  @IsPositive()
  price: number;
}
