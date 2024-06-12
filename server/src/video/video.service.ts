import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Video } from './video.entity';
import { Repository } from 'typeorm';
import { CreateVideoDto } from './dto/create-video-dto';

@Injectable()
export class VideoService {
  constructor(
    @InjectRepository(Video)
    private readonly videoRepository: Repository<Video>,
  ) {}

  async findAll() {
    return this.videoRepository.find();
  }

  async create(video: CreateVideoDto) {
    return this.videoRepository.save(video);
  }

  async delete(video: Video) {
    return this.videoRepository.delete({ id: video.id });
  }
}
