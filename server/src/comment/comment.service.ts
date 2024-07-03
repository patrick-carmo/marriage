import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from './comment.entity';
import { Repository } from 'typeorm';

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

  async delete(comment: Comment | { id: number }) {
    return this.commentRepository.delete({ id: comment.id });
  }
}
