import { CanActivate } from '@angular/router';
import { Injectable, inject } from '@angular/core';
import { AuthService } from '../services/auth/auth.service';
import { User } from '../types/interfaces';
import { UtilsService } from '../services/utils.service';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthGuardService implements CanActivate {
  private authService = inject(AuthService);
  private utilsService = inject(UtilsService);

  private user: User | null | undefined = null;

  async canActivate() {
    this.user =
      this.authService.user ??
      (await firstValueFrom(this.authService.getProfile()));

    if (this.user) {
      this.authService.user = this.user;
      return true;
    }

    await this.utilsService.navigate('home');
    return false;
  }
}
