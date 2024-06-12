import { IsNumber, IsString } from 'class-validator';

export class CreateVideoDto {
  @IsString()
  videoId: string;

  @IsString()
  url: string;

  @IsNumber()
  userId: number;

  @IsNumber()
  dataFolderId: number;
}
