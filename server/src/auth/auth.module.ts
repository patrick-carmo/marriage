import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { GoogleStrategy } from './google.strategy';
import { SessionSerializer } from './google.serialize';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [UserModule],
  providers: [GoogleStrategy, SessionSerializer],
  controllers: [AuthController],
})
export class AuthModule {}
