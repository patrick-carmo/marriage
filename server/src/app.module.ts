import { AuthModule } from './auth/auth.module';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DriveModule } from './drive/drive.module';
import { CommentModule } from './comment/comment.module';

@Module({
  imports: [
    AuthModule,
    DriveModule,
    CommentModule,
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      ssl: {
        ca: process.env.CA_CERT,
      },
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: process.env.ENV === 'development',
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
