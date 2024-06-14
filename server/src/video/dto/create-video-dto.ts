import { IsString, ValidateNested } from 'class-validator';
import { DataFolder } from 'src/dataFolder/data-folder.entity';
import { User } from 'src/user/user.entity';

export class CreateVideoDto {
  @IsString()
  videoId: string;

  @IsString()
  url: string;

  @ValidateNested()
  user: User;

  @ValidateNested()
  dataFolder: DataFolder;
}
