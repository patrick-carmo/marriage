import {
  Controller,
  Get,
  InternalServerErrorException,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { GoogleGuard } from './guards/google.guard';
import { GoogleAuthGuard } from './guards/google-auth.guard';
import { AuthService } from './auth.service';
import { User } from 'src/user/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(GoogleGuard)
  @Get('login')
  googleAuth() {
    return { message: 'Ok' };
  }

  @Get('google/callback')
  @UseGuards(GoogleGuard)
  async googleAuthRedirect(@Req() req: Request, @Res() res: Response) {
    const user = req.user as User;

    await this.authService.handleGoogleAuth(user);

    return res.redirect(
      process.env.ENV === 'production'
        ? '/marriage/recorder'
        : `${process.env.CLIENT}/marriage/recorder`,
    );
  }

  @Get('logout')
  @UseGuards(GoogleAuthGuard)
  logout(@Req() req: Request) {
    req.logout((err) => {
      if (err) {
        return new InternalServerErrorException('Internal server error');
      }
    });
    return { message: 'logout' };
  }
}
