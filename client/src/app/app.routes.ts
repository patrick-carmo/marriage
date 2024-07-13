import { Routes } from '@angular/router';
import { AuthGuardService } from './guards/auth.guard';
import { RoleGuard } from './guards/role.guard';
import { Role } from './enums/role.enum';

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
    canActivate: [AuthGuardService, RoleGuard],
    data: { roles: Role.Admin },
    loadChildren: () =>
      import('./pages/admin/tabs-received/tabs-received.routes').then(
        (m) => m.routes
      ),
  },
];
