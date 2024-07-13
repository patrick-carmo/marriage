import { Role } from '../enums/role.enum';
import { PostType } from './types';

export interface PhotoCard {
  src: string;
  title: string;
  content: string;
}

export interface User {
  email: string;
  name?: string;
  picture: string;
  role: Role;
}

export interface Comment {
  id: number;
  content: string;
  created_at: string;
  user: User;
}

export interface Photo {
  id: number;
  url: string;
  content: string;
  created_at: string;
  photo_id: string;
  user: User;
}

export interface Video {
  id: number;
  url: string;
  created_at: string;
  video_id: string;
  user: User;
}

export interface Pagination {
  page: number;
  pages: number;
  total: number;
  limit: number;
}

export interface CommentResponse extends Pagination {
  comment: Comment[];
}

export interface PhotoResponse extends Pagination {
  photo: Photo[];
}

export interface VideoResponse extends Pagination {
  video: Video[];
}

export interface UploadVideoResponse {
  url: string;
  videoId: string;
}

export interface UploadPhotoResponse {
  url: string;
  photoId: string;
}
