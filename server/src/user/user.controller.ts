import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { GoogleAuthGuard } from 'src/guards/google-auth.guard';
import { User } from './entity/user.entity';

@UseGuards(GoogleAuthGuard)
@Controller('user')
export class UserController {
  @Get('profile')
  async getProfile(@Req() req: Request) {
    const { email, name, picture, role } = req.user as User;

    const user = {
      email,
      name,
      picture,
      role,
    };

    return user;
  }
}
