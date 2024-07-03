import { Component, inject } from '@angular/core';
import {
  IonApp,
  IonMenu,
  IonMenuToggle,
  IonRouterOutlet,
  IonHeader,
  IonGrid,
  IonToolbar,
  IonRow,
  IonLabel,
  IonChip,
  IonAvatar,
  IonCol,
  IonTitle,
  IonItem,
  IonIcon,
  IonContent,
  IonList,
  IonRouterLink,
  IonButtons,
  IonMenuButton,
  IonButton,
  IonFab,
} from '@ionic/angular/standalone';
import { AuthService } from './services/auth/auth.service';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { addIcons } from 'ionicons';
import {
  camera,
  chatbox,
  exit,
  home,
  image,
  trash,
  videocam,
} from 'ionicons/icons';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonFab,
    IonButton,
    IonButtons,
    IonCol,
    IonRow,
    IonGrid,
    IonChip,
    IonAvatar,
    IonItem,
    IonApp,
    IonRouterOutlet,
    IonMenu,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonList,
    IonIcon,
    IonLabel,
    IonMenuToggle,
    IonMenuButton,
    IonRouterLink,
    RouterLink,
  ],
})
export class AppComponent {
  protected authService = inject(AuthService);
  constructor() {
    addIcons({ home, videocam, image, camera, trash, chatbox, exit });
  }
}
