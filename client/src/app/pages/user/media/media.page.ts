import { AfterViewInit, Component, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonIcon,
  IonButton,
  IonProgressBar,
  IonTextarea,
  IonText,
  ModalController,
  IonChip,
  IonAvatar,
  IonInput,
} from '@ionic/angular/standalone';
import { DriveService } from 'src/app/services/drive/drive.service';
import { UtilsService } from 'src/app/services/utils.service';
import { WebsocketService } from 'src/app/services/websocket.service';
import { Observable, Subscription } from 'rxjs';
import { PostType } from 'src/app/types/types';
import { CommentService } from 'src/app/services/comment/comment.service';
import { CommentModalComponent } from 'src/app/components/comment-modal/comment-modal.component';
import { AuthService } from 'src/app/services/auth/auth.service';
import { HeaderComponent } from '../../../components/header/header.component';

@Component({
  selector: 'app-media',
  templateUrl: './media.page.html',
  styleUrls: ['./media.page.scss'],
  standalone: true,
  imports: [
    IonInput,
    IonAvatar,
    IonChip,
    IonTextarea,
    IonProgressBar,
    IonButton,
    IonIcon,
    IonLabel,
    IonSegment,
    IonSegmentButton,
    IonContent,
    IonHeader,
    IonTitle,
    IonText,
    IonToolbar,
    CommonModule,
    FormsModule,
    HeaderComponent,
  ],
})
export class MediaPage implements OnDestroy, AfterViewInit {
  protected readonly authService = inject(AuthService);
  private readonly driveService = inject(DriveService);
  private readonly commentService = inject(CommentService);
  private readonly utilsService = inject(UtilsService);
  private readonly socketService = inject(WebsocketService);
  private readonly modalController = inject(ModalController);

  protected formType: PostType = 'photo';
  private form: HTMLFormElement | null = null;
  protected file: File | null = null;
  protected photoURL: string | null = null;
  protected videoURL: string | null = null;

  protected comment: string = '';
  protected minContentLength: number = 15;
  protected maxContentLength: number = 250;

  protected buffer: number = 0.1;
  protected progress: number = 0;
  protected percent: number = 0;

  private progressSub: Subscription | undefined;
  protected showProgressBar: boolean = false;

  private loadingDimissed: boolean = false;

  protected isSending: Boolean = false;
  protected showSubmit: Boolean = false;

  protected fileName: string = '';

  ngAfterViewInit() {
    this.form = document.getElementById('form') as HTMLFormElement | null;
  }

  ngOnDestroy() {
    this.progressSub?.unsubscribe();
    this.socketService.disconnect();
  }

  protected async openCommentModal() {
    const modal = await this.modalController.create({
      component: CommentModalComponent,
      componentProps: {
        comment: this.comment,
        maxLength: this.maxContentLength,
        minLength: this.minContentLength,
        picture: this.authService.user?.picture,
      },
      breakpoints: [0, 0.5, 1],
      initialBreakpoint: 1,
      cssClass: 'comment-modal',
    });

    modal.present();

    const { data: content } = await modal.onWillDismiss();

    if (!content) return;

    this.comment = content;
    this.onCommentInput({ target: { value: content } });
  }

  protected onSegmentChanged(event: CustomEvent) {
    this.formType = event.detail.value as PostType;
    this.reset();
  }

  protected async onFileChange(event: any) {
    this.file = event.target.files[0];
    await this.verifyFile(this.file);

    if (this.file) {
      this.fileName = this.file.name;

      this.formType === 'photo'
        ? (this.photoURL = URL.createObjectURL(this.file))
        : (this.videoURL = URL.createObjectURL(this.file));

      return;
    }
    this.fileName = '';
    this.photoURL = null;
    this.videoURL = null;
  }

  private async verifyFile(file: File | null | undefined) {
    if (!file) {
      this.showSubmit = false;

      await this.utilsService.showToast({
        message: `Por favor, envie ${
          this.formType === 'video' ? 'um vídeo' : 'uma foto'
        }`,
      });

      return false;
    }

    const allowedTypes = ['video', 'image'];

    const isValidType = allowedTypes.some((type) => file.type.includes(type));

    if (!isValidType) {
      await this.utilsService.showToast({
        message: 'Tipo de arquivo inválido',
      });

      return false;
    }

    const maxSize = 1024 * 1024 * 1024;

    if (file.size > maxSize) {
      await this.utilsService.showToast({
        message: 'Arquivo muito grande',
        duration: 5000,
      });

      return false;
    }

    if (this.formType === 'photo' && !this.comment) {
      return (this.showSubmit = false);
    }

    return (this.showSubmit = true);
  }

  protected onCommentInput(event: any) {
    if (this.formType === 'comment')
      return (this.showSubmit =
        event.target.value.length >= this.minContentLength);

    const fileExists = this.file ? true : false;

    if (this.formType === 'photo')
      this.showSubmit =
        fileExists && event.target.value.length >= this.minContentLength;

    return;
  }

  protected clearTextArea() {
    this.comment = '';
    this.showSubmit = false;
  }

  protected async sendForm(event: Event) {
    event.preventDefault();
    this.form = event.target as HTMLFormElement;

    if (!this.form) return;
    if (!(await this.validateForm())) return;

    await this.utilsService.showLoading({
      message: 'Aguarde. Preparando o envio...',
      duration: 60000,
    });

    this.isSendingForm();

    const uuid: string = this.formType !== 'comment' ? crypto.randomUUID() : '';

    const formData = new FormData(this.form);
    formData.append('uuid', uuid);

    if (this.formType !== 'comment') this.setupSocket(uuid);

    const observable = this.getObservable(formData);
    this.subscribeToObservable(observable);
  }

  private async validateForm() {
    if (this.formType === 'comment' && !this.comment) {
      await this.utilsService.showToast({
        message: 'Por favor, digite um comentário',
      });
      return false;
    }
    if (this.formType !== 'comment') {
      if (!this.file) {
        await this.utilsService.showToast({
          message: 'Por favor, envie um arquivo',
        });
        return false;
      }

      const fileCheckResult = await this.verifyFile(this.file);
      if (!fileCheckResult) return false;
    }
    return true;
  }

  private getObservable(formData: FormData) {
    if (this.formType === 'comment')
      return this.commentService.create(formData);

    type DriveMethodName = 'uploadVideo' | 'uploadPhoto';

    const driveMethodName =
      `upload${this.formType[0].toUpperCase()}${this.formType.slice(
        1
      )}` as DriveMethodName;

    return this.driveService[driveMethodName](formData);
  }

  private subscribeToObservable(observable: Observable<any>) {
    observable.subscribe({
      next: this.successResponse(),
      error: this.errorResponse,
      complete: this.completeResponse,
    });
  }

  private successResponse = () => async () => {
    await this.utilsService.showToast({
      message: `${
        this.formType === 'comment' ? 'Comentário' : 'Arquivo'
      } enviado com sucesso`,
      color: 'success',
      duration: 5000,
    });
    this.reset();
  };

  private errorResponse = async ({ error }: any) => {
    await this.utilsService.showToast({
      message: error.message || 'Erro ao enviar o arquivo',
      color: 'danger',
      duration: 4000,
    });
    this.reset();
    await this.utilsService.dimissLoading();
  };

  private completeResponse = async () => {
    this.reset();
    await this.utilsService.dimissLoading();
  };

  private setupSocket(uuid: string) {
    this.socketService.connect();
    this.socketService.emit('join', uuid);

    this.showProgressBar = true;

    this.socketService.progress().subscribe((data: any) => {
      if (data !== 0 && !this.loadingDimissed) {
        this.utilsService.dimissLoading();
        this.loadingDimissed = true;
      }

      this.buffer = data / 100 + 0.1;
      this.progress = data / 100;

      this.percent = parseFloat(data.toPrecision(2));
    });
  }

  private isSendingForm(isSending: boolean = true) {
    this.showSubmit = isSending;
    this.isSending = isSending;
  }

  protected reset() {
    this.isSendingForm(false);
    this.showProgressBar = false;
    this.loadingDimissed = false;
    this.fileName = '';

    this.buffer = 0.1;
    this.progress = 0;
    this.percent = 0;

    this.progressSub?.unsubscribe();
    this.socketService.disconnect();

    this.comment = '';
    this.file = null;
    this.photoURL = null;
    this.videoURL = null;
    this.form?.reset();
  }
}
