import { IsUUID } from 'class-validator';

export class DriveUploadVideoDto {
  @IsUUID(undefined, { message: 'uuid is not valid' })
  uuid: string;
}
