import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class AuthGoogleDTO {
  @ApiProperty({
    description: 'ID Token do google que deve ser gerado pelo front-end',
    example: 'eyJhbG... (Google ID Token)',
  })
  @IsString()
  idToken: string;
}
