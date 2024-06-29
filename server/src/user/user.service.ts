import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async find(user: User) {
    return this.userRepository.findOneBy({ id: user.id });
  }

  async findByGoogle(user: User) {
    return this.userRepository.findOneBy({ google_id: user.google_id });
  }

  async create(user: User) {
    return this.userRepository.save(user);
  }

  async update(user: User) {
    return this.userRepository.update({ google_id: user.google_id }, user);
  }
}
