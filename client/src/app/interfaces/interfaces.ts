export interface User {
  googleId: string;
  email: string;
  name?: string;
  picture: string;
}

export interface uploadVideoResponse {
  url: string;
  videoId: string;
}

export interface uploadPhotoResponse {
  url: string;
  photoId: string;
}

export interface Photos {
  src: string;
  title: string;
  content: string;
}
