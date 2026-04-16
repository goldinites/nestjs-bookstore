import { IsInt, IsPositive } from 'class-validator';

export class DeleteReviewDto {
  @IsInt()
  @IsPositive()
  reviewId: number;
}
