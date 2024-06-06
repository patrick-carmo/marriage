import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { GoogleStrategy } from './google.strategy';
import { SessionSerializer } from './google.serialize';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [UserModule],
  providers: [AuthService, GoogleStrategy, SessionSerializer],
  controllers: [AuthController],
})
export class AuthModule {}
