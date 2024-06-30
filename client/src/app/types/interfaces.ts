export interface User {
  googleId: string;
  email: string;
  name?: string;
  picture: string;
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

export interface Photos {
  src: string;
  title: string;
  content: string;
}
