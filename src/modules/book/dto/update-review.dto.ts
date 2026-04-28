import { IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateReviewDto {
  @IsString()
  @IsOptional()
  @Type(() => String)
  text: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @IsOptional()
  @Type(() => Number)
  @Min(1)
  @Max(5)
  rating: number;
}
