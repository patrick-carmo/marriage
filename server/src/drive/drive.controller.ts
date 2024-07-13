import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  MaxFileSizeValidator,
  Param,
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
import { DriveUploadVideoDTO } from './dto/drive-upload-video.dto';
import { Request } from 'express';
import { User } from 'src/user/entity/user.entity';
import { RoleGuard } from 'src/guards/role.guard';
import { Roles } from 'src/shared/decorators/role.decorator';
import { Role } from 'src/shared/enums/role.enum';
import { DriveUploadPhotoDTO } from './dto/drive-upload-photo.dto';

@UseGuards(GoogleAuthGuard, RoleGuard)
@Controller('drive')
export class DriveController {
  constructor(private readonly driveService: DriveService) {}

  @Post('upload/video')
  @UseInterceptors(FileInterceptor('video'))
  async uploadVideo(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({ fileType: 'video/*' }),
          new MaxFileSizeValidator({
            maxSize: 1024 * 1024 * 1024,
            message: 'O arquivo é muito grande',
          }),
        ],
        exceptionFactory: () =>
          new BadRequestException(
            'Arquivo inválido. Por favor, envie um vídeo.',
          ),
      }),
    )
    video: Express.Multer.File,
    @Body()
    { uuid }: DriveUploadVideoDTO,
    @Req() req: Request,
  ) {
    const user = req.user as User;
    return this.driveService.videoUpload(user, uuid, video);
  }

  @Post('upload/photo')
  @UseInterceptors(FileInterceptor('photo'))
  async uploadPhoto(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({
            fileType: 'image/*',
          }),
        ],
        exceptionFactory: () =>
          new BadRequestException(
            'Arquivo inválido. Por favor, envie uma imagem.',
          ),
      }),
    )
    photo: Express.Multer.File,
    @Body()
    body: DriveUploadPhotoDTO,
    @Req() req: Request,
  ) {
    const user = req.user as User;
    return this.driveService.photoUpload(user, body, photo);
  }

  @Roles(Role.Admin)
  @Delete('delete/:fileId')
  async deleteFile(@Param('fileId') fileId: string) {
    return this.driveService.deleteFile(fileId);
  }

  @Roles(Role.Admin)
  @Delete('delete-all')
  async deleteAll() {
    return this.driveService.deleteAll();
  }
}
