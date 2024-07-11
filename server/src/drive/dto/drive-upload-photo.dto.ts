import { IntersectionType } from '@nestjs/mapped-types';
import { CreateCommentDTO } from 'src/comment/dto/create-comment.dto';
import { DriveUploadVideoDTO } from './drive-upload-video.dto';

export class DriveUploadPhotoDTO extends IntersectionType(
  CreateCommentDTO,
  DriveUploadVideoDTO,
) {}
