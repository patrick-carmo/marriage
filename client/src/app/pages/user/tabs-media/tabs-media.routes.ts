import { Routes } from '@angular/router';
import { TabsMediaPage } from './tabs-media.page';

export const routes: Routes = [
  {
    path: '',
    component: TabsMediaPage,
    children: [
      {
        path: 'home',
        loadComponent: () =>
          import('../home/home.page').then((m) => m.HomePage),
      },
      {
        path: 'media',
        loadComponent: () =>
          import('../media/media.page').then((m) => m.MediaPage),
      },
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
      },
    ],
  },
];
