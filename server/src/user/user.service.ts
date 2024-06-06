import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async find(user: User) {
    return this.userRepository.findOneBy({ googleId: user.googleId });
  }

  async create(user: User) {
    return this.userRepository.save(user);
  }

  async update(user: User) {
    const updatedUser = await this.userRepository.update(
      { googleId: user.googleId },
      user,
    );

    return updatedUser;
  }
}
