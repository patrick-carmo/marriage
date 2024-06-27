import { CanActivate } from '@angular/router';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { User } from '../../interfaces/interfaces';
import { UtilsService } from '../utils.service';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthGuardService implements CanActivate {
  private user: User | null | undefined = null;

  constructor(private auth: AuthService, private utils: UtilsService) {}

  async canActivate() {
    this.user = this.auth.user;

    if (!this.user) {
      this.user = await firstValueFrom(this.auth.getProfile());
      if (this.user) {
        this.auth.user = this.user;
        return true;
      }

      await this.utils.navigate('home');
      return false;
    }

    return true;
  }
}
