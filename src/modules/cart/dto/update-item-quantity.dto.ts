import { IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateItemQuantityDto {
  @IsInt()
  @Type(() => Number)
  @Min(0)
  quantity: number;
}
