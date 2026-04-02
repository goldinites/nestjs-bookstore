import { IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class RefreshTokenDto {
  @Type(() => String)
  @IsString()
  refreshToken: string;
}
