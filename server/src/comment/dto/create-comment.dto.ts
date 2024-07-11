import { IsString, Length } from 'class-validator';

export class CreateCommentDTO {
  @Length(10, 250, { message: 'A mensagem deve ter entre 10 e 250 caracteres' })
  @IsString({ message: 'A mensagem deve ser uma string' })
  content: string;
}
