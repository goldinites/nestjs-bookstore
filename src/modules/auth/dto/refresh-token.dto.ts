import { IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class RefreshTokenDto {
  @IsString()
  @Type(() => String)
  refreshToken: string;
}
