import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  FileTypeValidator,
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
import { DriveUploadDto } from './dto/drive-upload.dto';
import { Request } from 'express';
import { User } from 'src/user/user.entity';
import { RoleGuard } from 'src/guards/role.guard';
import { Roles } from 'src/decorators/role.decorator';
import { Role } from 'src/enums/role.enum';

@UseGuards(GoogleAuthGuard, RoleGuard)
@Controller('drive')
export class DriveController {
  constructor(private readonly driveService: DriveService) {}

  @Roles(Role.Admin, Role.User)
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

  @Roles(Role.Admin, Role.User)
  @Post('upload/photo')
  @UseInterceptors(FileInterceptor('photo'))
  async uploadPhoto(
    @UploadedFile(
      new ParseFilePipe({
        validators: [new FileTypeValidator({ fileType: 'image/*' })],
        exceptionFactory: () =>
          new BadRequestException(
            'Arquivo inválido. Por favor, envie uma imagem.',
          ),
      }),
    )
    photo: Express.Multer.File,
    @Body()
    { uuid }: DriveUploadDto,
    @Req() req: Request,
  ) {
    const user = req.user as User;
    return this.driveService.photoUpload(user, uuid, photo);
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
