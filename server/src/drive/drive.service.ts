import { BadRequestException, Injectable, OnModuleInit } from '@nestjs/common';
import { drive_v3, google } from 'googleapis';
import * as fs from 'fs';
import { DriveGateway } from './drive.gateway';

@Injectable()
export class DriveService implements OnModuleInit {
  private service: drive_v3.Drive;

  constructor(private readonly driveGateway: DriveGateway) {}

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

  async searchFolderByName(name: string): Promise<string | null> {
    const file = await this.service.files.list({
      q: `name = '${name}' and '${process.env.DRIVE_FOLDER}' in parents`,
      fields: 'files(id)',
    });

    if (!file.data.files || !file.data.files.length) {
      return null;
    }

    return file.data.files[0].id;
  }

  async searchFolder(folderId: string): Promise<string | null> {
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
