import { IsNumber, IsString } from 'class-validator';

export class CreateDataFolderDto {
  @IsString()
  folderId: string;

  @IsNumber()
  userId: number;
}
