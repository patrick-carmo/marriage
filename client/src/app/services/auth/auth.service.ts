import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { User } from '../../interfaces/interfaces';
import { BehaviorSubject, Subscription, catchError, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService implements OnDestroy {
  private user$ = new BehaviorSubject<User | null>(null);
  private userSub$: Subscription | null = null;
  private userData: User | null = null;

  apiUrl = import.meta.env['NG_APP_SERVER'] ?? '';

  constructor(private http: HttpClient) {
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
    return this.http.get(`${this.apiUrl}/api/auth/logout`);
  }

  getProfile() {
    return this.http
      .get<User>(`${this.apiUrl}/api/user/profile`)
      .pipe(catchError(() => of(null)));
  }
}
