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
} from '@ionic/angular/standalone';
import { User } from 'src/app/interfaces/interfaces';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { UtilsService } from 'src/app/services/utils.service';
import { CommonModule } from '@angular/common';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss', '../../app.component.scss'],
  standalone: true,
  imports: [
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
  ],
})
export class HomePage implements OnDestroy {
  private user$: Subscription;
  protected user: User | null = null;

  protected form: FormGroup<any> = inject(FormBuilder).group({
    data: ['', Validators.required],
  });
  private progressInterval: any;

  protected buffer: number = 0.1;
  protected progress: number = 0;
  protected showProgressBar: boolean = false;

  protected showSubmit: Boolean = false;
  protected message: string[] = [];

  constructor(
    private auth: AuthService,
    private storage: StorageService,
    private utils: UtilsService
  ) {
    this.user$ = this.auth.getUser().subscribe((user) => (this.user = user));
  }

  ngOnDestroy(): void {
    this.user$.unsubscribe();
  }

  protected verifyForm() {
    this.showSubmit = this.form.valid;
  }

  private updateProgressBar(uuid: string) {
    this.showProgressBar = true;
    this.storage.getProgress(uuid).subscribe((data) => {
      this.utils.dimisLoading();
      const progress = data.progress / 100;
      this.buffer = progress + 0.05;
      this.progress = progress;
    });
  }

  private clearInterval() {
    this.buffer = 0.05;
    this.progress = 0;
    this.showProgressBar = false;
    clearInterval(this.progressInterval);
  }

  async sendVideo(event: Event) {
    event.preventDefault();

    if (this.form.invalid) {
      this.utils.showToast({
        color: 'warning',
        message: 'Please select/recorder a video.',
      });
      return;
    }

    this.showSubmit = false;

    this.utils.showToast({
      message: 'Iniciando upload...',
      color: 'primary',
    });

    const uuid: string = crypto.randomUUID();

    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);
    formData.append('uuid', uuid);

    this.progressInterval = setInterval(
      () => this.updateProgressBar(uuid),
      2000
    );

    this.storage.uploadVideo(formData).subscribe(
      (data) => {
        this.clearInterval();
        this.utils.showToast({
          message: `Video enviado com sucesso`,
          color: 'success',
          duration: 15000,
        });

        this.message[0] = `Video enviado com sucesso`;
        this.message[1] = data.url;
      },
      (error) => {
        this.clearInterval();
        this.utils.showToast({
          message: 'Erro ao enviar o video',
          color: 'danger',
          duration: 5000,
        });
      }
    );
  }

  logout() {
    this.auth.logout().subscribe(() => {
      this.utils.showToast({
        color: 'success',
        message: 'Logout successfully',
      });

      this.utils.navigate('/login');
    });
  }
}
