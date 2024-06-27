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
  loginURL = `${this.apiUrl}/api/auth/login`;

  constructor(
    private http: HttpClient,
    private readonly utilsService: UtilsService
  ) {
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

  logout() {
    const logout = this.http.get(`${this.apiUrl}/api/auth/logout`);

    logout.subscribe(
      async () => {
        await this.utilsService.showToast({
          color: 'success',
          message: 'Deslogado com sucesso',
        });

        this.user = null;
        window.location.reload();
      },
      async () => {
        await this.utilsService.showToast({
          color: 'danger',
          duration: 5000,
          message: 'Logout falhou',
        });

        window.location.reload()
      }
    );
  }

  getProfile() {
    return this.http
      .get<User>(`${this.apiUrl}/api/user/profile`)
      .pipe(catchError(() => of(null)));
  }
}
