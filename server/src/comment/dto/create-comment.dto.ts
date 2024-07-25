import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export class CreateCommentDTO {
  @ApiProperty({
    description: 'Mensagem',
    example: 'A mensagem deve ter entre 10 e 500 caracteres',
    minLength: 10,
    maxLength: 500,
  })
  @Length(10, 500, { message: 'A mensagem deve ter entre 10 e 500 caracteres' })
  @IsString({ message: 'A mensagem deve ser uma string' })
  content: string;
}
