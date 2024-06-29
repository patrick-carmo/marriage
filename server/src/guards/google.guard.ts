import { ExecutionContext, CanActivate, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class GoogleGuard extends AuthGuard('google') implements CanActivate {
  async canActivate(context: ExecutionContext) {
    try {
      const activate = (await super.canActivate(context)) as boolean;

      const req = context.switchToHttp().getRequest();

      await super.logIn(req);
      return activate;
    } catch {
      const res = context.switchToHttp().getResponse();

      return res.redirect(process.env.CLIENT || '/');
    }
  }
}
