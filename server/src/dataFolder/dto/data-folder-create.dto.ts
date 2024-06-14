import { IsString } from 'class-validator';
import { User } from 'src/user/user.entity';

export class CreateDataFolderDto {
  @IsString()
  folderId: string;

  user: Pick<User, 'id'>;
}
