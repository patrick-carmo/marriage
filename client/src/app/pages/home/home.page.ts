import { Component, OnDestroy, inject } from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonItem,
  IonLabel,
  IonInput,
  IonTextarea,
  IonProgressBar,
  IonFab,
  IonImg,
  IonAvatar,
  IonChip,
} from '@ionic/angular/standalone';
import { User } from 'src/app/interfaces/interfaces';
import { AuthService } from 'src/app/services/auth/auth.service';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { UtilsService } from 'src/app/services/utils.service';
import { CommonModule } from '@angular/common';
import { StorageService } from 'src/app/services/storage/storage.service';
import { RouterLink } from '@angular/router';
import { WebsocketService } from 'src/app/services/websocket.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss', '../../app.component.scss'],
  standalone: true,
  imports: [
    IonChip,
    IonAvatar,
    IonImg,
    IonFab,
    IonProgressBar,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonTextarea,
    IonInput,
    IonLabel,
    IonItem,
    IonButton,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    RouterLink,
  ],
})
export class HomePage implements OnDestroy {
  protected user: User | null = null;

  protected form: FormGroup<any> = inject(FormBuilder).group({
    video: ['', Validators.required],
  });

  protected buffer: number = 0.1;
  protected progress: number = 0;
  private progressSub: Subscription | undefined;
  protected showProgressBar: boolean = false;

  protected showSubmit: Boolean = false;

  constructor(
    private auth: AuthService,
    private storage: StorageService,
    private utils: UtilsService,
    private socket: WebsocketService
  ) {}

  ionViewWillEnter() {
    this.user = this.auth.user;
  }

  ngOnDestroy() {
    this.progressSub?.unsubscribe();
    this.socket.disconnect();
  }

  protected verifyForm() {
    this.showSubmit = this.form.valid;
  }

  async sendVideo(event: Event) {
    event.preventDefault();
    this.showProgressBar = true;

    if (this.form.invalid) {
      await this.utils.showToast({
        color: 'warning',
        message: 'Por favor, selecione ou grave um vídeo.',
      });
      return;
    }

    this.showSubmit = false;

    const uuid: string = crypto.randomUUID();

    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);
    formData.append('uuid', uuid);

    this.setupSocket(uuid);

    this.storage.uploadVideo(formData).subscribe(
      async (data) => {
        await this.utils.showToast({
          message: `Video enviado com sucesso`,
          color: 'success',
          duration: 30000,
          buttons: [
            {
              text: 'Abrir',
              handler: () => {
                window.open(data.url, '_blank');
              },
            },
          ],
        });
      },
      async () => {
        await this.utils.showToast({
          message: 'Erro ao enviar o video',
          color: 'danger',
          duration: 5000,
        });
        this.reset();
      },
      () => {
        this.reset();
      }
    );
  }

  private setupSocket(uuid: string) {
    this.socket.connect();
    this.socket.emit('join', uuid);

    this.socket.progress().subscribe((data: any) => {
      this.buffer = data / 100 + 0.05;
      this.progress = data / 100;
    });
  }

  logout() {
    this.auth.logout().subscribe(
      async () => {
        await this.utils.showToast({
          color: 'success',
          message: 'Logout successfully',
        });

        this.auth.user = null;
        this.reset();
        this.utils.navigate('/login');
      },
      async () =>
        await this.utils.showToast({
          color: 'danger',
          message: 'Logout failed',
        })
    );
  }

  reset() {
    this.showSubmit = false;
    this.form.reset();

    this.buffer = 0.1;
    this.progress = 0;
    this.showProgressBar = false;

    this.progressSub?.unsubscribe();
    this.socket.disconnect();
  }
}
