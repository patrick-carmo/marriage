import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from 'src/user/entity/user.entity';
import { JwtService } from '@nestjs/jwt';
import { Auth } from 'googleapis';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  private readonly issuer = 'login';
  private readonly audience = 'user';

  private readonly oAuth: Auth.OAuth2Client;

  constructor(
    private readonly JWTService: JwtService,
    private readonly userService: UserService,
  ) {
    this.oAuth = new Auth.OAuth2Client({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      redirectUri: process.env.GOOGLE_REDIRECT_URI,
    });
  }

  async loginGoogle(idToken: string) {
    const data = await this.oAuth.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = data.getPayload();

    const user: User = {
      google_id: payload.sub,
      email: payload.email,
      name: payload.name,
      picture: payload.picture,
    };

    return this.handleUser(user);
  }

  private readonly handleUser = async (user: User) => {
    const userExists = await this.userService.findByGoogle(user);

    if (!userExists) {
      const newUser = await this.userService.create(user);
      return this.createToken(newUser);
    }

    await this.userService.update(user);
    return this.createToken(userExists);
  };

  createToken(user: User) {
    return {
      accessToken: this.JWTService.sign(
        {
          id: user.id,
          email: user.email,
          name: user.name,
          picture: user.picture,
          role: user.role,
        },
        {
          expiresIn: '7d',
          subject: user.id.toString(),
          issuer: this.issuer,
          audience: this.audience,
          secret: process.env.JWT_SECRET,
        },
      ),
    };
  }

  checkToken(token: string) {
    try {
      return this.JWTService.verify(token, {
        issuer: this.issuer,
        audience: this.audience,
        secret: process.env.JWT_SECRET,
      });
    } catch (e) {
      throw new UnauthorizedException(e);
    }
  }
}
