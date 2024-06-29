import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { GoogleAuthGuard } from 'src/guards/google-auth.guard';

@Controller('user')
export class UserController {
  @UseGuards(GoogleAuthGuard)
  @Get('profile')
  async getProfile(@Req() req: Request) {
    return req.user;
  }
}
