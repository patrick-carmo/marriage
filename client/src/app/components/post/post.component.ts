import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import {
  IonItem,
  IonContent,
  IonRefresher,
  IonRefresherContent,
  IonList,
  IonCard,
  IonCardHeader,
  IonAvatar,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
} from '@ionic/angular/standalone';
import { SafePipe } from 'src/app/pipes/safe.pipe';
import { InfiniteScroll } from 'src/app/shared/infinite-scroll';
import { Comment, Photo, Video } from 'src/app/types/interfaces';
import { Post } from 'src/app/types/types';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss'],
  standalone: true,
  imports: [
    HeaderComponent,
    IonInfiniteScrollContent,
    IonInfiniteScroll,
    IonCardContent,
    IonCardSubtitle,
    IonCardTitle,
    IonAvatar,
    IonCardHeader,
    IonCard,
    IonList,
    IonRefresherContent,
    IonRefresher,
    IonContent,
    IonItem,
    CommonModule,
    SafePipe,
  ],
})
export class PostComponent {
  @Input() items: Post[] = [];

  protected isComment(post: Post): post is Comment {
    return (post as Comment).content !== undefined && !(post as Photo).url;
  }

  protected isPhoto(post: Post): post is Photo {
    return (
      (post as Photo).url !== undefined && (post as Photo).content !== undefined
    );
  }

  protected isVideo(post: Post): post is Video {
    return (post as Video).url !== undefined;
  }
}
