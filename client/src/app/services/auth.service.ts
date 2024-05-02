import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { User } from '../interfaces/interfaces';
import { BehaviorSubject, Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService implements OnDestroy {
  private user$ = new BehaviorSubject<User | null>(null);
  private userSub$: Subscription | null = null;

  apiUrl = import.meta.env['NG_APP_URL'] ?? '';

  constructor(private http: HttpClient) {
    this.userSub$ = this.getProfile().subscribe((user) => {
      this.user$.next(user);
    });

    console.log('API URL:', this.apiUrl);
  }

  ngOnDestroy() {
    this.userSub$?.unsubscribe();
  }

  login() {
    return this.http.get(`${this.apiUrl}/api/login`);
  }

  logout() {
    return this.http.get(`${this.apiUrl}/api/logout`, {
      withCredentials: true,
    });
  }

  getProfile() {
    return this.http.get<User>(`${this.apiUrl}/api/profile`, {
      withCredentials: true,
    });
  }

  getUser() {
    return this.user$.asObservable();
  }
}
