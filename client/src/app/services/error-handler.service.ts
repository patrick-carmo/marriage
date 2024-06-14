import { ErrorHandler, Injectable } from '@angular/core';
import { UtilsService } from './utils.service';

@Injectable({
  providedIn: 'root',
})
export class ErrorHandlerService implements ErrorHandler {
  constructor(private utils: UtilsService) {}

  async handleError() {
    await this.utils.dimisLoading();

    await this.utils.showToast({
      header: 'Erro',
      message: 'Erro interno. Tente novamente mais tarde.',
      color: 'danger',
      duration: 4000,
    });
  }
}
