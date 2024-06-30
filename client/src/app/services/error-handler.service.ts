import { ErrorHandler, Injectable, inject } from '@angular/core';
import { UtilsService } from './utils.service';

@Injectable({
  providedIn: 'root',
})
export class ErrorHandlerService implements ErrorHandler {
  private readonly utilsService = inject(UtilsService);

  async handleError() {
    await this.utilsService.dimissLoading();

    await this.utilsService.showToast({
      header: 'Erro',
      message: 'Erro interno. Tente novamente mais tarde.',
      color: 'danger',
      duration: 4000,
    });
  }
}
