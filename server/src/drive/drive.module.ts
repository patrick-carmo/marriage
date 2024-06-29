import { Module } from '@nestjs/common';
import { DriveService } from './drive.service';
import { DriveController } from './drive.controller';
import { MulterModule } from '@nestjs/platform-express';
import * as os from 'os';
import { DriveGateway } from './drive.gateway';
import { FolderModule } from 'src/folder/folder.module';
import { VideoModule } from 'src/video/video.module';
import { PhotoModule } from 'src/photo/photo.module';

@Module({
  imports: [
    MulterModule.register({
      dest: os.tmpdir(),
    }),
    FolderModule,
    VideoModule,
    PhotoModule,
  ],
  controllers: [DriveController],
  providers: [DriveService, DriveGateway],
})
export class DriveModule {}
