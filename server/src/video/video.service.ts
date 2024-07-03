import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Video } from './video.entity';
import { Repository } from 'typeorm';

@Injectable()
export class VideoService {
  constructor(
    @InjectRepository(Video)
    private readonly videoRepository: Repository<Video>,
  ) {}

  async findAll() {
    return this.videoRepository.find();
  }

  async create(video: Video) {
    return this.videoRepository.save(video);
  }

  async delete(video: Video | { video_id: string }) {
    return this.videoRepository.delete({ video_id: video.video_id });
  }
}
