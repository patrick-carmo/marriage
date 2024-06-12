import { BadRequestException, Injectable, OnModuleInit } from '@nestjs/common';
import { drive_v3, google } from 'googleapis';
import * as fs from 'fs';
import { DriveGateway } from './drive.gateway';
import { User } from 'src/user/user.entity';
import { VideoService } from 'src/video/video.service';
import { DataFolderService } from 'src/dataFolder/data-folder.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class DriveService implements OnModuleInit {
  private service: drive_v3.Drive;

  constructor(
    private readonly driveGateway: DriveGateway,
    private readonly dataFolderService: DataFolderService,
    private readonly videoService: VideoService,
    private readonly userService: UserService,
  ) {}

  async onModuleInit() {
    const auth = new google.auth.JWT(
      process.env.DRIVE_EMAIL,
      undefined,
      process.env.DRIVE_KEY,
      process.env.DRIVE_SCOPE,
    );

    await auth.authorize();
    this.service = google.drive({ version: 'v3', auth });
  }

  async uploadOperation(user: User, uuid: string, video: Express.Multer.File) {
    const dbUser = await this.userService.find(user);

    const dataFolder =
      (await this.dataFolderService.find(dbUser)) ||
      (await this.dataFolderService.create({
        userId: dbUser.id,
        folderId: await this.createFolder(user.name),
      }));

    const folderId = dataFolder.folderId;

    const image = await this.uploadVideo(uuid, video, folderId);

    await this.videoService.create({
      userId: dbUser.id,
      videoId: image.videoId,
      dataFolderId: dataFolder.id,
      url: image.url,
    });

    return image;
  }

  async searchFolderByName(name: string) {
    const file = await this.service.files.list({
      q: `name = '${name}' and '${process.env.DRIVE_FOLDER}' in parents`,
      fields: 'files(id)',
    });

    if (!file.data.files || !file.data.files.length) {
      return null;
    }

    return file.data.files[0].id;
  }

  async searchFolder(folderId: string) {
    const file = await this.service.files.get({
      fileId: folderId,
      fields: 'id',
    });

    if (!file.data.id) {
      return null;
    }

    return file.data.id;
  }

  async createFolder(name: string) {
    const fileMetaData = {
      name,
      parents: [process.env.DRIVE_FOLDER],
      mimeType: process.env.DRIVE_MIMETYPE,
    };

    const file = await this.service.files.create({
      requestBody: fileMetaData,
      fields: 'id',
    });

    if (!file.data.id) {
      throw new BadRequestException('Error creating folder');
    }

    return file.data.id;
  }

  async uploadVideo(
    uuid: string,
    video: Express.Multer.File,
    folderId: string,
  ) {
    const { path, mimetype: mimeType, originalname: name } = video;

    const requestBody = {
      name,
      parents: [folderId],
    };

    const media = {
      mimeType,
      body: fs.createReadStream(path),
    };

    const file = await this.service.files.create(
      {
        requestBody,
        media,
        fields: 'id',
      },
      {
        onUploadProgress: (event) => {
          const progress = Math.round((event.bytesRead / video.size) * 100);

          this.driveGateway.emitProgress(uuid, progress);
        },
      },
    );

    const { id: videoId } = file.data;

    if (!videoId) {
      throw new BadRequestException('Error uploading file');
    }

    const image = {
      videoId,
      url: `https://drive.google.com/file/d/${videoId}/preview`,
    };

    return image;
  }

  deleteFile = async (fileId: string) => {
    return this.service.files.delete({
      fileId,
    });
  };

  deleteAll = async () => {
    const file = await this.service.files.list({
      q: `'${process.env.DRIVE_FOLDER}' in parents`,
      fields: 'files(id, name, webViewLink)',
    });
    const files = file.data.files;

    if (!files || !files.length) {
      return { message: 'No files found' };
    }

    console.log(files);

    for (const file of files) {
      await this.service.files.delete({
        fileId: file.id,
      });
      console.log(`File "${file.name}" deleted.`);
    }

    return { message: 'All files deleted' };
  };
}
