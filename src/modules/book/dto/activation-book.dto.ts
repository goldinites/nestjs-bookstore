import { IsBoolean, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class ActivationBookDto {
  @IsBoolean()
  @IsOptional()
  @Type(() => Boolean)
  isActive?: boolean;
}
