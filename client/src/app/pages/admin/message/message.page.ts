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
import { CommentService } from 'src/app/services/comment/comment.service';
import { UtilsService } from 'src/app/services/utils.service';
import { Comment, CommentResponse } from 'src/app/types/interfaces';

@Component({
  selector: 'app-message',
  templateUrl: './message.page.html',
  styleUrls: ['./message.page.scss'],
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
  ],
})
export class MessagePage implements OnInit {
  private readonly commentService = inject(CommentService);
  private readonly utilsService = inject(UtilsService);

  protected comments: Comment[] = [];

  private page: number = 1;
  private limit: number = 10;
  private totalPages: number = 1;

  protected infiniteDisabled: boolean = false;

  async ngOnInit() {
    return this.generateItems();
  }

  private async generateItems(method: 'push' | 'unshift' = 'push') {
    this.commentService
      .list(this.page, this.limit)
      .subscribe((response: CommentResponse) => {
        this.comments[method](...response.comment);
        this.totalPages = response.pages;

        this.page++;
      });
  }

  protected async onIonInfinite(ev: any) {
    if (this.page > this.totalPages) {
      this.infiniteDisabled = true;
      await this.utilsService.showToast({
        message: 'Não há mais mensagens.',
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
      this.comments = [];
      this.page = 1;

      await this.generateItems();

      this.infiniteDisabled = false;
      event.target.complete();
    }, 1000);
  }
}
