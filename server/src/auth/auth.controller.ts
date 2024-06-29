import {
  Controller,
  Get,
  InternalServerErrorException,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { GoogleGuard } from '../guards/google.guard';
import { GoogleAuthGuard } from '../guards/google-auth.guard';

@Controller('auth')
export class AuthController {
  constructor() {}

  @UseGuards(GoogleGuard)
  @Get('login')
  googleAuth() {
    return { message: 'Ok' };
  }

  @UseGuards(GoogleGuard)
  @Get('google/callback')
  async googleAuthRedirect(@Res() res: Response) {
    return res.redirect(
      process.env.ENV === 'development'
        ? process.env.CLIENT + process.env.VIDEO_PAGE
        : process.env.VIDEO_PAGE,
    );
  }

  @UseGuards(GoogleAuthGuard)
  @Get('logout')
  logout(@Req() req: Request) {
    req.logout((err) => {
      if (err) {
        return new InternalServerErrorException('Internal server error');
      }
    });
    return { message: 'logout' };
  }
}
