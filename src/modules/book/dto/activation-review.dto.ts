import { IsBoolean, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class ActivationReviewDto {
  @IsBoolean()
  @IsOptional()
  @Type(() => Boolean)
  isActive?: boolean;
}
