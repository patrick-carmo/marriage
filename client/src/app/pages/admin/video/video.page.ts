import { Component, inject, OnInit } from '@angular/core';
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
  InfiniteScrollCustomEvent,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonRefresher,
  IonRefresherContent,
} from '@ionic/angular/standalone';
import { HeaderComponent } from '../../../components/header/header.component';
import { UtilsService } from 'src/app/services/utils.service';
import { VideoService } from 'src/app/services/video/video.service';
import { Video, VideoResponse } from 'src/app/types/interfaces';
import { SafePipe } from 'src/app/pipes/safe.pipe';

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
    SafePipe,
  ],
})
export class VideoPage implements OnInit {
  private readonly videoService = inject(VideoService);
  private readonly utilsService = inject(UtilsService);

  protected videos: Video[] = [];

  private page: number = 1;
  private limit: number = 10;
  private totalPages: number = 1;

  protected infiniteDisabled: boolean = false;

  async ngOnInit() {
    return this.generateItems();
  }

  private async generateItems(method: 'push' | 'unshift' = 'push') {
    this.videoService
      .list(this.page, this.limit)
      .subscribe((response: VideoResponse) => {
        this.videos[method](...response.video);
        this.totalPages = response.pages;

        this.page++;
      });
  }

  protected async onIonInfinite(ev: any) {
    if (this.page > this.totalPages) {
      this.infiniteDisabled = true;
      await this.utilsService.showToast({
        message: 'Não há mais videos.',
      });

      return;
    }

    await this.generateItems();

    setTimeout(() => {
      (
        (ev as InfiniteScrollCustomEvent).target as HTMLIonInfiniteScrollElement
      ).complete();
    }, 2000);
  }

  protected async handleRefresh(event: any) {
    setTimeout(async () => {
      this.videos = [];
      this.page = 1;

      await this.generateItems();

      this.infiniteDisabled = false;
      event.target.complete();
    }, 1000);
  }
}
