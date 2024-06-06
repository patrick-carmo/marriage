import { Module } from '@nestjs/common';
import { DriveService } from './drive.service';
import { DriveController } from './drive.controller';
import { MulterModule } from '@nestjs/platform-express';
import * as os from 'os';
import { DriveGateway } from './drive.gateway';

@Module({
  imports: [
    MulterModule.register({
      dest: os.tmpdir(),
    }),
  ],
  controllers: [DriveController],
  providers: [DriveService, DriveGateway],
})
export class DriveModule {}
