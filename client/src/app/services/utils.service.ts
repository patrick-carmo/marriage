import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
  LoadingController,
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
    const { header, message, color, buttons, duration } = fields;

    const toast = await this.toast.create({
      header,
      message,
      color,
      buttons,
      swipeGesture: 'vertical',
      duration: duration ?? 2000,
    });

    await toast.present();
  }

  async showLoading(message: string = 'Enviando...') {
    this.loading = await this.loadingCtrl.create({
      message,
    });

    await this.loading.present();
  }

  async dimisLoading() {
    if (this.loading) {
      await this.loading.dismiss();
    }
  }

  async navigate(path: string) {
    return this.router.navigate([path]);
  }
}
