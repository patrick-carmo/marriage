import { IsString, Length } from 'class-validator';

export class CreateCommentDTO {
  @Length(10, 500, { message: 'A mensagem deve ter entre 10 e 500 caracteres' })
  @IsString({ message: 'A mensagem deve ser uma string' })
  content: string;
}
