import { IsOptional, IsString } from 'class-validator';
import { User } from 'src/user/user.entity';
import { Folder } from '../folder.entity';

export class CreateFolderDto {
  @IsString()
  user: Pick<User, 'id'>;

  @IsString()
  folder_id: Folder['folder_id'];

  @IsString()
  folder_type: Folder['folder_type'];

  @IsOptional()
  @IsString()
  parent_folder?: Folder;
}
