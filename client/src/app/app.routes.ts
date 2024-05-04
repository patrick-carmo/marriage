import { Routes } from '@angular/router';
import { AuthGuardService } from './services/auth/auth-guard.service';

export const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuardService],
    loadComponent: () =>
      import('./pages/home/home.page').then((m) => m.HomePage),
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login.page').then((m) => m.LoginPage),
  },
];
