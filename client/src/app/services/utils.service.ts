import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Browser } from '@capacitor/browser';
import { Capacitor } from '@capacitor/core';
import {
  AlertController,
  AlertOptions,
  LoadingController,
  LoadingOptions,
  PopoverController,
  PopoverOptions,
  ToastController,
  ToastOptions,
} from '@ionic/angular/standalone';

@Injectable({
  providedIn: 'root',
})
export class UtilsService {
  private readonly toastCtrl = inject(ToastController);
  private readonly loadingCtrl = inject(LoadingController);
  private readonly popoverCtrl = inject(PopoverController);
  private readonly alertCtrl = inject(AlertController);
  private readonly router = inject(Router);

  protected loading: HTMLIonLoadingElement | null = null;

  private readonly isNative = Capacitor.getPlatform() !== 'web';

  async showToast(fields: ToastOptions) {
    const toast = await this.toastCtrl.create({
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
      color: fields.color ?? 'warning',
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

  async showPopover(fields: PopoverOptions) {
    const popover = await this.popoverCtrl.create({
      ...fields,
    });
    return popover.present();
  }

  async showAlert(fields: AlertOptions) {
    const alert = await this.alertCtrl.create({
      ...fields,
    });
    return alert.present();
  }

  async dimissLoading() {
    if (this.loading) {
      await this.loading.dismiss();
    }
  }

  async navigate(path: string) {
    return this.router.navigate([path]);
  }

  async openURL(url: string) {
    return this.isNative ? Browser.open({ url }) : window.open(url, '_self');
  }
}
