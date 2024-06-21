import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { User } from '../../interfaces/interfaces';
import { BehaviorSubject, Subscription, catchError, of } from 'rxjs';
import { UtilsService } from '../utils.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService implements OnDestroy {
  private user$ = new BehaviorSubject<User | null>(null);
  private userSub$: Subscription | null = null;
  private userData: User | null = null;

  apiUrl = import.meta.env['NG_APP_SERVER'] ?? '';
  loginOrLogoutURL = `${this.apiUrl}/api/auth/login`;

  constructor(
    private http: HttpClient,
    private readonly utilsService: UtilsService
  ) {
    this.userSub$ = this.user$.subscribe((user) => {
      this.userData = user;

      if (user) {
        this.loginOrLogoutURL = `${this.apiUrl}/api/auth/logout`;
        return;
      }

      this.loginOrLogoutURL = `${this.apiUrl}/api/auth/login`;
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

  logout() {
    const logout = this.http.get(`${this.apiUrl}/api/auth/logout`);

    logout.subscribe(
      async () => {
        await this.utilsService.showToast({
          color: 'success',
          message: 'Deslogado com sucesso',
        });

        this.user = null;
        await this.utilsService.navigate('/home');
      },
      async () => {
        await this.utilsService.showToast({
          color: 'danger',
          message: 'Logout falhou',
        });

        await this.utilsService.navigate('/home');
      }
    );
  }

  getProfile() {
    return this.http
      .get<User>(`${this.apiUrl}/api/user/profile`)
      .pipe(catchError(() => of(null)));
  }
}
