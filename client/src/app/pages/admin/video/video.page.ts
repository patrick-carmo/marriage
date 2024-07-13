import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonCard,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonCardContent,
  IonList,
  IonItem,
  IonLabel,
  IonInput,
  IonAvatar,
  IonChip,
  IonText,
  IonThumbnail,
  IonIcon,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonRefresher,
  IonRefresherContent,
} from '@ionic/angular/standalone';
import { HeaderComponent } from '../../../components/header/header.component';
import { VideoService } from 'src/app/services/video/video.service';
import { Video } from 'src/app/types/interfaces';
import { SafePipe } from 'src/app/pipes/safe.pipe';
import { InfiniteScroll } from '../../../shared/infinite-scroll';
import { PostComponent } from 'src/app/components/post/post.component';

@Component({
  selector: 'app-video',
  templateUrl: './video.page.html',
  styleUrls: ['./video.page.scss'],
  standalone: true,
  imports: [
    IonRefresherContent,
    IonRefresher,
    IonInfiniteScrollContent,
    IonInfiniteScroll,
    IonIcon,
    IonThumbnail,
    IonText,
    IonChip,
    IonAvatar,
    IonInput,
    IonLabel,
    IonItem,
    IonList,
    IonCardContent,
    IonCardTitle,
    IonCardSubtitle,
    IonCardHeader,
    IonCard,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    HeaderComponent,
    PostComponent,
    SafePipe,
  ],
})
export class VideoPage extends InfiniteScroll<Video> {
  private readonly videoService = inject(VideoService);
  protected responseKey = 'video';

  protected fetchData() {
    return this.videoService.list(this.page, this.limit);
  }
}
