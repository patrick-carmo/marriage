import { IsUUID } from 'class-validator';

export class DriveUploadDto {
  @IsUUID(undefined, { message: 'uuid is not valid' })
  uuid: string;
}
