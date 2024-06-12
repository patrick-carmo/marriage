import {
  Body,
  Controller,
  FileTypeValidator,
  Get,
  ParseFilePipe,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { DriveService } from './drive.service';
import { GoogleAuthGuard } from 'src/auth/guards/google-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { DriveUploadDto } from './dto/drive-upload.dto';
import { Request } from 'express';
import { User } from 'src/user/user.entity';

@UseGuards(GoogleAuthGuard)
@Controller('drive')
export class DriveController {
  constructor(private readonly driveService: DriveService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('video'))
  async uploadVideo(
    @UploadedFile(
      new ParseFilePipe({
        validators: [new FileTypeValidator({ fileType: 'video/*' })],
      }),
    )
    video: Express.Multer.File,
    @Body()
    { uuid }: DriveUploadDto,
    @Req() req: Request,
  ) {
    const user = req.user as User;

    return this.driveService.uploadOperation(user, uuid, video);
  }

  @Get('delete')
  async deleteFile(fileId: string) {
    return this.driveService.deleteFile(fileId);
  }

  @Get('delete-all')
  async deleteAll() {
    return this.driveService.deleteAll();
  }
}
