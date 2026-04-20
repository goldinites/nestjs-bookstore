import { Type } from 'class-transformer';
import {
  IsInt,
  IsNumber,
  IsPositive,
  IsString,
  Min,
  Max,
  IsOptional,
} from 'class-validator';

export class CreateBookDto {
  @IsString()
  @Type(() => String)
  title: string;

  @IsString()
  @Type(() => String)
  author: string;

  @IsString()
  @Type(() => String)
  genre: string;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Max(9999)
  publishedYear: number;

  @Type(() => Number)
  @IsInt()
  @IsPositive()
  categoryId: number;

  @IsString()
  @Type(() => String)
  language: string;

  @IsString()
  @Type(() => String)
  description: string;

  @Type(() => Number)
  @IsInt()
  @IsOptional()
  @Min(0)
  stockCount?: number;

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(1)
  @Max(5)
  @IsOptional()
  rating: number;

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  price: number;

  @IsString()
  @IsOptional()
  @Type(() => String)
  imageUrl?: string;
}
