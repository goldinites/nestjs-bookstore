import { IsEmail, IsEnum, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { Roles } from '@/modules/user/enums/roles.enum';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @Type(() => String)
  @IsString()
  password?: string;

  @IsOptional()
  @IsEnum(Roles)
  role?: string;
}
