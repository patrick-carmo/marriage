import { Role } from '../enums/role.enum';

export interface User {
  email: string;
  name?: string;
  picture: string;
  role: Role;
}

export interface Photo {
  src: string;
  title: string;
  content: string;
}

export interface Comment {
  content: string;
}

export interface UploadVideoResponse {
  url: string;
  videoId: string;
}

export interface UploadPhotoResponse {
  url: string;
  photoId: string;
}
