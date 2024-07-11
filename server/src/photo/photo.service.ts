import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Photo } from './entity/photo.entity';

@Injectable()
export class PhotoService {
  constructor(
    @InjectRepository(Photo)
    private readonly photoRepository: Repository<Photo>,
  ) {}

  async list(page: number = 1, limit: number = 10) {
    const [photo, total] = await this.photoRepository.findAndCount({
      take: limit,
      skip: (page - 1) * limit,
    });

    return { photo, total, page, limit, pages: Math.ceil(total / limit) };
  }

  async create(photo: Photo) {
    return this.photoRepository.save(photo);
  }

  async delete(photo: Photo | { photo_id: string }) {
    return this.photoRepository.delete({ photo_id: photo.photo_id });
  }
}
