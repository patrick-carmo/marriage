import { Routes } from '@angular/router';
import { AuthGuardService } from './services/auth/auth-guard.service';

export const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuardService],
    loadChildren: () =>
      import('./pages/tabs/tabs.routes').then((m) => m.routes),
  },
  {
    path: 'home',
    loadComponent: () =>
      import('./pages/home/home.page').then((m) => m.HomePage),
  },
];
