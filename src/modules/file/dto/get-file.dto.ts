import { IsString } from 'class-validator';

export class GetFileDto {
  @IsString()
  fileId: string;
}
