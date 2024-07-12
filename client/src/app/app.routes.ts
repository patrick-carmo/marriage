import { Routes } from '@angular/router';
import { AuthGuardService } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/marriage',
    pathMatch: 'full',
  },
  {
    path: 'home',
    loadComponent: () =>
      import('./pages/user/home/home.page').then((m) => m.HomePage),
  },
  {
    path: 'marriage',
    canActivate: [AuthGuardService],
    loadChildren: () =>
      import('./pages/user/tabs-media/tabs-media.routes').then((m) => m.routes),
  },
  {
    path: 'received',
    canActivate: [AuthGuardService],
    loadChildren: () =>
      import('./pages/admin/tabs-received/tabs-received.routes').then(
        (m) => m.routes
      ),
  },
];
