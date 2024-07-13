import { Comment, Photo, Video } from './interfaces';

export type PostType = 'video' | 'photo' | 'comment';

export type Post = Photo | Video | Comment;
