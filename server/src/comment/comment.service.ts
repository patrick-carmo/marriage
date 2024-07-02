import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from './comment.entity';
import { Repository } from 'typeorm';
import { CreateCommentDTO } from './dto/create-comment.dto';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
  ) {}

  async findAll() {
    return this.commentRepository.find();
  }

  async create(comment: Comment) {
    return this.commentRepository.save(comment);
  }

  async delete(comment: Comment) {
    return this.commentRepository.delete({ id: comment.id });
  }
}
