import { Controller, Get, UseGuards } from '@nestjs/common';
import { UserDecorator } from 'src/decorators/user.decorator';
import { AuthGuard } from 'src/guards/auth.guard';
import { User } from './entity/user.entity';
import { SwaggerProfileDecorator } from './decorators/swagger';

@UseGuards(AuthGuard)
@Controller('user')
export class UserController {
  @SwaggerProfileDecorator()
  @Get('profile')
  async getProfile(@UserDecorator() user: User) {
    const { email, name, picture, role } = user;

    const profile = {
      email,
      name,
      picture,
      role,
    };

    return profile;
  }
}
