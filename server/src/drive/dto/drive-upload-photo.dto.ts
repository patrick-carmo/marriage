import { IsOptional, IsString } from 'class-validator';
import { DriveUploadVideoDto } from './drive-upload-video.dto';

export class DriveUploadPhotoDto extends DriveUploadVideoDto {
  @IsString()
  @IsOptional()
  content?: string;
}
