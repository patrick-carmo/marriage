import { IsString, ValidateNested } from 'class-validator';
import { Folder } from 'src/folder/folder.entity';
import { User } from 'src/user/user.entity';

export class CreateVideoDto {
  @IsString()
  video_id: string;

  @IsString()
  url: string;

  @ValidateNested()
  user: User;

  @ValidateNested()
  folder: Folder;
}
