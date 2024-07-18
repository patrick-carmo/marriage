import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy, inject } from '@angular/core';
import { User } from '../../types/interfaces';
import { BehaviorSubject, Subscription, catchError, of } from 'rxjs';
import { UtilsService } from '../utils.service';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';

@Injectable({
  providedIn: 'root',
})
export class AuthService implements OnDestroy {
  private readonly http = inject(HttpClient);
  private readonly utilsService = inject(UtilsService);

  private user$ = new BehaviorSubject<User | null>(null);
  private userSub$: Subscription | null = null;
  private userData: User | null = null;

  apiUrl = import.meta.env['NG_APP_SERVER'];

  constructor() {
    GoogleAuth.initialize({
      clientId:
        '266710469587-u5nmr1cb1mg472b6tme65ql9h2ee1ns5.apps.googleusercontent.com',
      scopes: ['profile', 'email'],
      grantOfflineAccess: true,
    }).catch((e: Error) => {
      console.error(e.message);
    });

    this.userSub$ = this.user$.subscribe((user) => {
      this.userData = user;
    });
  }

  ngOnDestroy() {
    this.userSub$?.unsubscribe();
  }

  set user(user: User | null) {
    this.user$.next(user);
  }

  get user() {
    return this.userData;
  }

  async googleLogin() {
    const data = await GoogleAuth.signIn();

    await this.utilsService.showLoading({
      message: 'Autenticando...',
    });

    const { idToken } = data.authentication;

    const login = this.http.post(`${this.apiUrl}/auth/login`, {
      idToken,
    });

    login.subscribe(
      (response: any) => {
        const token = response['accessToken'];

        if (token) {
          localStorage.setItem('jwtToken', token);
        }

        return (window.location.href = '/');
      },
      async () => {
        await this.utilsService.showToast({
          color: 'danger',
          duration: 5000,
          message: 'Login falhou',
        });
        return this.utilsService.dimissLoading();
      },
      async () => {
        return this.utilsService.dimissLoading();
      }
    );
  }

  logout() {
    this.user = null;
    localStorage.removeItem('jwtToken');
    return (window.location.href = '/');
  }

  getProfile() {
    return this.http.get<User>(`${this.apiUrl}/user/profile`).pipe(
      catchError(({ error }: any) => {
        if (error.code === 'jwt_error') {
          this.logout();
        }
        return of(null);
      })
    );
  }
}
