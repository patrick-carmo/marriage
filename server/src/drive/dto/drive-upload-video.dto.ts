import { IsUUID } from 'class-validator';

export class DriveUploadVideoDTO {
  @IsUUID(undefined, { message: 'UUID inválido' })
  uuid: string;
}
