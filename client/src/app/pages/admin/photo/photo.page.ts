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
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonRefresher,
  IonRefresherContent,
} from '@ionic/angular/standalone';
import { PhotoService } from 'src/app/services/photo/photo.service';
import { Photo } from 'src/app/types/interfaces';
import { SafePipe } from 'src/app/pipes/safe.pipe';
import { PostComponent } from 'src/app/components/post/post.component';
import { InfiniteScroll } from 'src/app/shared/infinite-scroll';
import { HeaderComponent } from 'src/app/components/header/header.component';

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
    PostComponent,
    HeaderComponent,
    SafePipe,
  ],
})
export class PhotoPage extends InfiniteScroll<Photo> {
  private readonly photoService = inject(PhotoService);
  protected responseKey: string = 'photo';

  protected fetchData() {
    return this.photoService.list(this.page, this.limit);
  }
}
