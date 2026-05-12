import { IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class DeleteItemDto {
  @IsInt()
  @Type(() => Number)
  @Min(1)
  bookId: number;
}
