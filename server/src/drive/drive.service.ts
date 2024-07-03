import {
  BadRequestException,
  Injectable,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { drive_v3, google } from 'googleapis';
import * as fs from 'fs';
import { DriveGateway } from './drive.gateway';
import { User } from 'src/user/user.entity';
import { VideoService } from 'src/video/video.service';
import { FolderService } from 'src/folder/folder.service';
import { FolderType } from 'src/folder/enum/folderType';
import { Folder } from 'src/folder/folder.entity';
import { PhotoService } from 'src/photo/photo.service';
import { DriveUploadPhotoDTO } from './dto/drive-upload-photo.dto';

@Injectable()
export class DriveService implements OnModuleInit {
  private service: drive_v3.Drive;

  constructor(
    private readonly driveGateway: DriveGateway,
    private readonly folderService: FolderService,
    private readonly videoService: VideoService,
    private readonly photoService: PhotoService,
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

  async videoUpload(user: User, uuid: string, video: Express.Multer.File) {
    const { uploadData, folder } = await this.uploadOperation(
      user,
      uuid,
      video,
      FolderType.Video,
    );

    await this.videoService.create({
      user,
      video_id: uploadData.videoId,
      folder,
      url: uploadData.url,
    });

    return uploadData;
  }

  async photoUpload(
    user: User,
    body: DriveUploadPhotoDTO,
    photo: Express.Multer.File,
  ) {
    const { uuid, content } = body;

    const { uploadData, folder } = await this.uploadOperation(
      user,
      uuid,
      photo,
      FolderType.Photo,
    );

    await this.photoService.create({
      user,
      photo_id: uploadData.imageId,
      folder,
      content,
      url: uploadData.url,
    });

    return uploadData;
  }

  private async uploadOperation(
    user: User,
    uuid: string,
    file: Express.Multer.File,
    folderType: FolderType,
  ) {
    const userFolder = await this.getFolder(user, FolderType.User);
    const folder = await this.getFolder(user, folderType, userFolder);

    const uploadData = await this.uploadFile(uuid, file, folder.folder_id);

    return { uploadData, folder };
  }

  private async getFolder(
    user: User,
    folder_type: FolderType,
    parent_folder?: Folder,
  ) {
    const folderExists = await this.folderService.findFolder(user, folder_type);

    if (folderExists) return folderExists;

    const createdFolder = await this.folderService.create({
      user,
      folder_id: await this.createFolder(
        parent_folder ? folder_type : user.name,
        parent_folder?.folder_id,
      ),
      folder_type,
      parent_folder,
    });

    return createdFolder;
  }

  private async createFolder(name: string, folderId?: string) {
    const fileMetaData = {
      name,
      parents: [folderId ?? process.env.DRIVE_FOLDER],
      mimeType: process.env.DRIVE_MIMETYPE,
    };

    const file = await this.service.files.create({
      requestBody: fileMetaData,
      fields: 'id',
    });

    if (!file.data.id) {
      throw new BadRequestException('Erro ao criar pasta no Drive');
    }

    return file.data.id;
  }

  private async uploadFile(
    uuid: string,
    file: Express.Multer.File,
    folderId: string,
  ) {
    const { path, mimetype: mimeType, originalname: name } = file;

    const requestBody = {
      name,
      parents: [folderId],
    };

    const media = {
      mimeType,
      body: fs.createReadStream(path),
    };

    const response = await this.service.files.create(
      {
        requestBody,
        media,
        fields: 'id',
      },
      {
        onUploadProgress: (event) => {
          const progress = Math.round((event.bytesRead / file.size) * 100);

          this.driveGateway.emitProgress(uuid, progress);
        },
      },
    );

    const type = mimeType.split('/')[0] + 'Id';

    const { id } = response.data;

    const data = {
      [type]: id,
      url: `https://drive.google.com/file/d/${type}/preview`,
    };

    return data;
  }

  private async getFile(fileId: string) {
    const { data } = await this.service.files.get({
      fileId,
      fields: 'id, name, webViewLink, mimeType, size, createdTime',
    });

    return data;
  }

  deleteFile = async (fileId: string) => {
    try {
      const file = await this.getFile(fileId);

      const fileType = file.mimeType.split('/')[0].includes('image')
        ? 'photo'
        : 'video';

      if (fileType === 'photo') {
        await this.photoService.delete({
          photo_id: file.id,
        });
      } else {
        await this.videoService.delete({
          video_id: file.id,
        });
      }

      await this.service.files.delete({
        fileId,
      });
    } catch {
      throw new NotFoundException('Arquivo não encontrado');
    }

    return { message: 'Arquivo deletado' };
  };

  deleteAll = async () => {
    const file = await this.service.files.list({
      q: `'${process.env.DRIVE_FOLDER}' in parents`,
      fields: 'files(id, name, webViewLink)',
    });
    const files = file.data.files;

    if (!files || !files.length) {
      throw new NotFoundException('No files found');
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
