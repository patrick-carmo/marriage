import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Photo } from './photo.entity';

@Injectable()
export class PhotoService {
  constructor(
    @InjectRepository(Photo)
    private readonly photoRepository: Repository<Photo>,
  ) {}

  async findAll() {
    return this.photoRepository.find();
  }

  async create(photo: Photo) {
    return this.photoRepository.save(photo);
  }

  async delete(photo: Photo) {
    return this.photoRepository.delete({ id: photo.id });
  }
}
