import { Module } from '@nestjs/common';
import { DriveService } from './drive.service';
import { DriveController } from './drive.controller';
import { MulterModule } from '@nestjs/platform-express';
import * as os from 'os';
import { DriveGateway } from './drive.gateway';
import { VideoModule } from 'src/video/video.module';
import { FolderModule } from 'src/folder/folder.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    MulterModule.register({
      dest: os.tmpdir(),
    }),
    FolderModule,
    VideoModule,
    UserModule,
  ],
  controllers: [DriveController],
  providers: [DriveService, DriveGateway],
})
export class DriveModule {}
