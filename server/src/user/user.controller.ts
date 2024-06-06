import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from 'src/entities/user.entity';
import { Request } from 'express';
import { GoogleAuthGuard } from 'src/auth/guards/googleAuth.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(GoogleAuthGuard)
  @Get('profile')
  async getProfile(@Req() req: Request) {
    const user = req.user as User;
    return this.userService.find(user);
  }
}
