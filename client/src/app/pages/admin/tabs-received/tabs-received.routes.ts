import { Routes } from '@angular/router';
import { TabsReceivedPage } from './tabs-received.page';

export const routes: Routes = [
  {
    path: '',
    component: TabsReceivedPage,
    children: [
      {
        path: 'message',
        loadComponent: () =>
          import('../message/message.page').then((m) => m.MessagePage),
      },
      {
        path: 'photo',
        loadComponent: () =>
          import('../photo/photo.page').then((m) => m.PhotoPage),
      },
      {
        path: 'video',
        loadComponent: () =>
          import('../video/video.page').then((m) => m.VideoPage),
      },
      {
        path: '',
        redirectTo: 'message',
        pathMatch: 'full',
      },
    ],
  },
];
