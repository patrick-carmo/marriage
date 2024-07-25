import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGoogleDTO } from './dto/auth-token.dto';
import { ApiTags } from '@nestjs/swagger';
import { SwaggerAuthLoginDecorator } from './decorators/auth-swagger.decorator';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @SwaggerAuthLoginDecorator()
  @Post('login')
  async login(@Body() { idToken }: AuthGoogleDTO) {
    return this.authService.loginGoogle(idToken);
  }
}
