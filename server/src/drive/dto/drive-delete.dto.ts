import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class DriveDeleteDTO {
  @ApiProperty()
  @IsString()
  fileId: string;
}
