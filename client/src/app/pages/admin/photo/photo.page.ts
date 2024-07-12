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
import { PhotoService } from 'src/app/services/photo/photo.service';
import { Photo, PhotoResponse } from 'src/app/types/interfaces';
import { SafePipe } from 'src/app/pipes/safe.pipe';

@Component({
  selector: 'app-photo',
  templateUrl: './photo.page.html',
  styleUrls: ['./photo.page.scss'],
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
export class PhotoPage implements OnInit {
  private readonly photoService = inject(PhotoService);
  private readonly utilsService = inject(UtilsService);

  protected photos: Photo[] = [];

  private page: number = 1;
  private limit: number = 10;
  private totalPages: number = 1;

  protected infiniteDisabled: boolean = false;

  async ngOnInit() {
    return this.generateItems();
  }

  private async generateItems(method: 'push' | 'unshift' = 'push') {
    this.photoService
      .list(this.page, this.limit)
      .subscribe((response: PhotoResponse) => {
        this.photos[method](...response.photo);
        console.log(response);
        this.totalPages = response.pages;

        this.page++;
      });
  }

  protected async onIonInfinite(ev: any) {
    if (this.page > this.totalPages) {
      this.infiniteDisabled = true;
      await this.utilsService.showToast({
        message: 'Não há mais fotos.',
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
      this.photos = [];
      this.page = 1;

      await this.generateItems();

      this.infiniteDisabled = false;
      event.target.complete();
    }, 1000);
  }
}
