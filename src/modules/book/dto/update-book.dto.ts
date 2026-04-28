import { Type } from 'class-transformer';
import {
  IsInt,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Min,
  Max,
} from 'class-validator';

export class UpdateBookDto {
  @IsString()
  @IsOptional()
  @Type(() => String)
  title?: string;

  @IsString()
  @IsOptional()
  @Type(() => String)
  description?: string;

  @IsOptional()
  @IsString()
  @Type(() => String)
  imageUrl?: string;

  @IsOptional()
  @IsString()
  @Type(() => String)
  author?: string;

  @IsString()
  @IsOptional()
  @Type(() => String)
  genre?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  categoryId?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Max(9999)
  publishedYear?: number;

  @IsOptional()
  @IsString()
  @Type(() => String)
  language?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  stockCount?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  price?: number;
}
