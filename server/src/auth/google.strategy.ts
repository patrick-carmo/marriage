import { Inject } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-google-oauth20';
import { User } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';

export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(@Inject(UserService) private readonly userService: UserService) {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      scope: ['profile', 'email'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
  ): Promise<any> {
    const { id, displayName, emails, photos } = profile;
    const googleUserData: User = {
      google_id: id,
      email: emails[0].value,
      name: displayName,
      picture: photos[0].value,
    };

    const userExists = await this.userService.findByGoogle(googleUserData);

    if (!userExists) return await this.userService.create(googleUserData);

    await this.userService.update(googleUserData);
    return userExists;
  }
}
