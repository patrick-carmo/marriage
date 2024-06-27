export interface User {
  googleId: string;
  email: string;
  name?: string;
  picture: string;
}

export interface uploadResponse {
  url: string;
  image_id: string;
}

export interface Photos {
  src: string;
  title: string;
  content: string;
}
