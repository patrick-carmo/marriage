import { ErrorHandler, Injectable, Injector, inject } from '@angular/core';
import { UtilsService } from './utils.service';

@Injectable({
  providedIn: 'root',
})
export class ErrorHandlerService implements ErrorHandler {
  private readonly injector = inject(Injector);

  async handleError({ error }: any) {
    const utilsService = this.injector.get(UtilsService);

    try {
      if (error.code === 'jwt_error') {
        await utilsService.showToast({
          message: 'Sessão expirada, faça login novamente.',
        });

        return setTimeout(() => {
          window.location.reload();
        }, 2500);
      }

      if (
        error === 'popup_closed_by_user' ||
        error === 'access_denied' ||
        error.code === '12501'
      ) {
        return utilsService.showToast({
          message: 'Autenticação cancelada',
        });
      }

      await utilsService.dimissLoading();

      return utilsService.showToast({
        message: 'Erro interno, tente novamente mais tarde.',
        color: 'danger',
      });
    } catch {}
  }
}
