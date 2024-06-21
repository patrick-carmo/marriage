import { Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

export const routes: Routes = [
  {
    path: 'marriage',
    component: TabsPage,
    children: [
      {
        path: 'home',
        loadComponent: () =>
          import('../home/home.page').then((m) => m.HomePage),
      },
      {
        path: 'recorder',
        loadComponent: () =>
          import('../recorder/recorder.page').then((m) => m.RecorderPage),
      },
      {
        path: '',
        redirectTo: '/marriage/home',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: '/marriage/home',
    pathMatch: 'full',
  },
];
