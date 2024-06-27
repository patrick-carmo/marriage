import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
  LoadingController,
  LoadingOptions,
  ToastController,
  ToastOptions,
} from '@ionic/angular/standalone';

@Injectable({
  providedIn: 'root',
})
export class UtilsService {
  protected loading: HTMLIonLoadingElement | null = null;
  constructor(
    private toast: ToastController,
    private loadingCtrl: LoadingController,
    private router: Router
  ) {}

  async showToast(fields: ToastOptions) {
    const toast = await this.toast.create({
      ...fields,
      duration: fields.duration ?? 2000,
      buttons: [
        ...(fields.buttons ?? []),
        {
          text: 'Fechar',
          role: 'cancel',
        },
      ],
      swipeGesture: fields.swipeGesture ?? 'vertical',
    });
    return toast.present();
  }

  async showLoading(fields: LoadingOptions) {
    this.loading = await this.loadingCtrl.create({
      ...fields,
      duration: fields.duration ?? 60000,
    });
    return this.loading.present();
  }

  async dimissLoading() {
    if (this.loading) {
      await this.loading.dismiss();
    }
  }

  async navigate(path: string) {
    return this.router.navigate([path]);
  }
}
