import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class DriveUploadVideoDTO {
  @ApiProperty({
    example: 'b55a848e-4d7c-4e75-bc60-36c39a54907a',
  })
  @IsUUID(undefined, { message: 'UUID inválido' })
  uuid: string;
}
