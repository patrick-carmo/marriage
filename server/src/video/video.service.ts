import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Video } from './entity/video.entity';
import { Repository } from 'typeorm';

@Injectable()
export class VideoService {
  constructor(
    @InjectRepository(Video)
    private readonly videoRepository: Repository<Video>,
  ) {}

  async list(page: number = 1, limit: number = 10) {
    const [video, total] = await this.videoRepository.findAndCount({
      take: limit,
      skip: (page - 1) * limit,
    });

    return { video, total, page, limit, pages: Math.ceil(total / limit) };
  }

  async create(video: Video) {
    return this.videoRepository.save(video);
  }

  async delete(video: Video | { video_id: string }) {
    return this.videoRepository.delete({ video_id: video.video_id });
  }
}
