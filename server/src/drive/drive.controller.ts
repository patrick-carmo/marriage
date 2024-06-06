import {
  Body,
  Controller,
  FileTypeValidator,
  Get,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { DriveService } from './drive.service';
import { GoogleAuthGuard } from 'src/auth/guards/googleAuth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { DriveUploadDto } from './dto/driveUpload.dto';

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
  ) {
    const folderId =
      (await this.driveService.searchFolderByName('videos')) ||
      (await this.driveService.createFolder('videos'));

    return await this.driveService.uploadVideo(uuid, video, folderId);
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
