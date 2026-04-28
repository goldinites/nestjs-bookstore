import { IsNumber, IsString, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class AddReviewDto {
  @IsString()
  @Type(() => String)
  text: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Type(() => Number)
  @Min(1)
  @Max(5)
  rating: number;
}
