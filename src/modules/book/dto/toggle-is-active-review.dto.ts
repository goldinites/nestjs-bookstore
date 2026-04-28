import { IsBoolean, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class ToggleIsActiveReviewDto {
  @IsBoolean()
  @IsOptional()
  @Type(() => Boolean)
  isActive?: boolean;
}
