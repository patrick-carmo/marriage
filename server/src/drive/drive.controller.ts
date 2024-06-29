import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  // Param,
  ParseFilePipe,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { DriveService } from './drive.service';
import { GoogleAuthGuard } from 'src/guards/google-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { DriveUploadDto } from './dto/drive-upload.dto';
import { Request } from 'express';
import { User } from 'src/user/user.entity';

@UseGuards(GoogleAuthGuard)
@Controller('drive')
export class DriveController {
  constructor(private readonly driveService: DriveService) {}

  @Post('upload/video')
  @UseInterceptors(FileInterceptor('video'))
  async uploadVideo(
    @UploadedFile(
      new ParseFilePipe({
        validators: [new FileTypeValidator({ fileType: 'video/*' })],
        exceptionFactory: () =>
          new BadRequestException(
            'Arquivo inválido. Por favor, envie um vídeo.',
          ),
      }),
    )
    video: Express.Multer.File,
    @Body()
    { uuid }: DriveUploadDto,
    @Req() req: Request,
  ) {
    const user = req.user as User;
    return this.driveService.videoUpload(user, uuid, video);
  }

  // @Delete('delete/:fileId')
  // async deleteFile(@Param('fileId') fileId: string) {
  //   return this.driveService.deleteFile(fileId);
  // }

  @Delete('delete-all')
  async deleteAll() {
    return this.driveService.deleteAll();
  }
}
