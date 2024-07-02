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
} from '@ionic/angular/standalone';
import { DriveService } from 'src/app/services/drive/drive.service';
import { UtilsService } from 'src/app/services/utils.service';
import { WebsocketService } from 'src/app/services/websocket.service';
import { Observable, Subscription } from 'rxjs';
import { User } from 'src/app/types/interfaces';
import { FormType } from 'src/app/types/types';
import { CommentService } from 'src/app/services/comment/comment.service';

@Component({
  selector: 'app-media',
  templateUrl: './media.page.html',
  styleUrls: ['./media.page.scss'],
  standalone: true,
  imports: [
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
    IonToolbar,
    CommonModule,
    FormsModule,
  ],
})
export class MediaPage implements OnDestroy, AfterViewInit {
  private readonly driveService = inject(DriveService);
  private readonly commentService = inject(CommentService);
  private readonly utilsService = inject(UtilsService);
  private readonly socketService = inject(WebsocketService);

  protected formType: FormType = 'video';
  private form: HTMLFormElement | null = null;
  private file: File | null = null;

  protected comment: string | null = null;
  protected minContentLength: number = 10;
  protected maxContentLength: number = 250;

  protected user: User | null = null;

  protected buffer: number = 0.1;
  protected progress: number = 0;
  protected percent: number = 0;

  private progressSub: Subscription | undefined;
  protected showProgressBar: boolean = false;

  private loadingDimissed: boolean = false;

  protected isSending: Boolean = false;
  protected showSubmit: Boolean = false;

  protected fileName: string = '';
  protected withMessage: boolean = false;

  constructor() {}

  ngAfterViewInit() {
    this.form = document.getElementById('form') as HTMLFormElement | null;
  }

  ngOnDestroy() {
    this.progressSub?.unsubscribe();
    this.socketService.disconnect();
  }

  protected onSegmentChanged(event: CustomEvent) {
    this.formType = event.detail.value as FormType;
    this.reset();
  }

  protected async onFileChange(event: any) {
    this.file = event.target.files[0];
    await this.verifyFile(this.file);
    this.file ? (this.fileName = this.file.name) : (this.fileName = '');
  }

  private async verifyFile(file: File | null | undefined) {
    if (!file) {
      this.showSubmit = false;

      await this.utilsService.showToast({
        color: 'warning',
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
        color: 'warning',
        message: 'Tipo de arquivo inválido',
      });

      return false;
    }

    const maxSize = 1024 * 1024 * 1024;

    if (file.size > maxSize) {
      await this.utilsService.showToast({
        color: 'warning',
        message: 'Arquivo muito grande',
      });

      return false;
    }

    return (this.showSubmit = true);
  }

  protected onCommentInput(event: any) {
    if (this.formType === 'comment')
      return (this.showSubmit =
        event.target.value.length >= this.minContentLength);

    const fileExists = this.file ? true : false;

    if (this.formType === 'photo') {
      this.showSubmit =
        fileExists &&
        this.withMessage &&
        event.target.value.length >= this.minContentLength;
    }
    return;
  }

  protected toggleMessage() {
    this.withMessage = !this.withMessage;

    const fileExists = this.file ? true : false;

    if (this.withMessage)
      this.showSubmit = fileExists && this.comment?.length! >= 10;
    else this.showSubmit = fileExists;
  }

  protected clearTextArea() {
    this.comment = null;
    if (this.formType === 'comment') this.showSubmit = false;
    if (this.formType === 'photo') this.withMessage = false;
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
        color: 'warning',
        message: 'Por favor, digite um comentário',
      });
      return false;
    }

    if (this.formType === 'photo' && this.withMessage) {
      if (!this.comment) {
        await this.utilsService.showToast({
          color: 'warning',
          message: 'Por favor, digite uma mensagem',
        });
        return false;
      }
      if (
        this.comment.length < this.minContentLength ||
        this.comment.length > this.maxContentLength
      ) {
        await this.utilsService.showToast({
          color: 'warning',
          message: `Mensagem muito ${
            this.comment.length < this.minContentLength ? 'curta' : 'longa'
          }`,
        });
        return false;
      }
    }
    if (this.formType !== 'comment') {
      if (!this.file) {
        await this.utilsService.showToast({
          color: 'warning',
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
      return this.commentService.createComment(formData);

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

  private errorResponse = async (error: any) => {
    await this.utilsService.showToast({
      message: error.error.message || 'Erro ao enviar o arquivo',
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
    this.withMessage = false;
    this.fileName = '';

    this.buffer = 0.1;
    this.progress = 0;
    this.percent = 0;

    this.progressSub?.unsubscribe();
    this.socketService.disconnect();

    this.comment = null;
    this.file = null;
    this.form?.reset();
  }
}
