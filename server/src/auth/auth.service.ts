import { Injectable } from '@nestjs/common';
import { User } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  async handleGoogleAuth(user: User) {
    const userExists = await this.userService.findByGoogle(user);

    userExists
      ? await this.userService.update(user)
      : await this.userService.create(user);
  }
}
