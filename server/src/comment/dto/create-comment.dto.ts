import { IsString, MaxLength, MinLength } from 'class-validator';

export class CreateCommentDTO {
  @MinLength(10, { message: 'A mensagem deve ter no mínimo 10 caracteres' })
  @MaxLength(250, {
    message: 'A mensagem deve ter no máximo 250 caracteres',
  })
  @IsString({ message: 'A mensagem deve ser uma string' })
  content: string;
}
