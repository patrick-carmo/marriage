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
  PopoverController,
  IonText,
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
import { ProfileComponent } from './components/profile/profile.component';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [
    IonText,
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
  private popoverController = inject(PopoverController);
  constructor() {
    addIcons({ home, videocam, image, camera, trash, chatbox, exit });
  }

  async showProfile(e: Event) {
    const popover = await this.popoverController.create({
      component: ProfileComponent,
      componentProps: {
        user: this.authService.user,
      },
      event: e,
      translucent: true,
    });

    return popover.present();
  }
}
