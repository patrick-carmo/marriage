import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
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
  IonItemSliding,
  IonItemOptions,
  IonItemOption,
  IonIcon,
} from '@ionic/angular/standalone';
import { SafePipe } from 'src/app/pipes/safe.pipe';
import { Comment, Photo, Video } from 'src/app/types/interfaces';
import { Post, PostType } from 'src/app/types/types';
import { HeaderComponent } from '../header/header.component';
import { DriveService } from 'src/app/services/drive/drive.service';
import { UtilsService } from 'src/app/services/utils.service';
import { CommentService } from 'src/app/services/comment/comment.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss'],
  standalone: true,
  imports: [
    IonIcon,
    IonItemOption,
    IonItemOptions,
    IonItemSliding,
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
  private readonly driveService = inject(DriveService);
  private readonly commentService = inject(CommentService);
  private readonly utilsService = inject(UtilsService);

  @Input() items: Post[] = [];
  @Input() postType: PostType | undefined;

  protected isComment(post: Post): post is Comment {
    return 'content' in post && !('url' in post);
  }

  protected isPhoto(post: Post): post is Photo {
    return 'url' in post && 'content' in post;
  }

  protected isVideo(post: Post): post is Video {
    return 'url' in post && !('content' in post);
  }

  protected async deletePost(post: Post, index: number) {
    await this.utilsService.showAlert({
      header: 'Excluir post',
      message: 'Deseja realmente excluir este post?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Excluir',
          cssClass: 'alert-button-confirm',
          role: 'confirm',
          handler: () => this.delete(post, index),
        },
      ],
    });
  }

  private async delete(post: Post, index: number) {
    switch (this.postType) {
      case 'comment':
        this.subscribeToObservable(this.commentService.delete(post.id), index);
        break;
      case 'photo':
        this.subscribeToObservable(
          this.driveService.delete((post as Photo).photo_id),
          index
        );
        break;
      case 'video':
        this.subscribeToObservable(
          this.driveService.delete((post as Video).video_id),
          index
        );
        break;
      default:
        await this.utilsService.showToast({
          message: 'Erro ao excluir post',
          color: 'danger',
        });
        break;
    }
  }

  private subscribeToObservable = (
    observable: Observable<any>,
    index: number
  ) => {
    observable.subscribe(
      async () => {
        await this.utilsService.showToast({
          message: 'Post excluído com sucesso!',
          color: 'success',
        });
        this.items.splice(index, 1);
      },
      async () => {
        await this.utilsService.showToast({
          message: 'Erro ao excluir post',
          color: 'danger',
        });
      }
    );
  };
}
