import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from './entity/comment.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
  ) {}

  async list(page: number = 1, limit: number = 10) {
    const [comment, total] = await this.commentRepository.findAndCount({
      order: { created_at: 'DESC' },
      relations: ['user'],
      select: {
        user: {
          id: true,
          name: true,
          email: true,
          picture: true,
        },
      },
      take: limit,
      skip: (page - 1) * limit,
    });

    return { comment, total, page, limit, pages: Math.ceil(total / limit) };
  }

  async create(comment: Comment) {
    return this.commentRepository.save(comment);
  }

  async delete(comment: Comment | { id: number }) {
    return this.commentRepository.delete({ id: comment.id });
  }
}
