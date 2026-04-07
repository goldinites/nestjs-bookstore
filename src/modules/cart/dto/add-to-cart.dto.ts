import { IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class AddToCartDto {
  @IsInt()
  @Type(() => Number)
  @Min(1)
  bookId: number;

  @IsInt()
  @Type(() => Number)
  @Min(1)
  quantity: number;
}
