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
  IonText,
  IonAccordionGroup,
  IonAccordion,
} from '@ionic/angular/standalone';
import { AuthService } from './services/auth/auth.service';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { addIcons } from 'ionicons';
import {
  camera,
  chatbox,
  chevronDownCircleOutline,
  close,
  exit,
  home,
  image,
  send,
  trash,
  videocam,
} from 'ionicons/icons';
import { ProfileComponent } from './components/profile/profile.component';
import { UtilsService } from './services/utils.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [
    IonAccordion,
    IonAccordionGroup,
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
  protected readonly authService = inject(AuthService);
  private readonly utilsService = inject(UtilsService);
  constructor() {
    addIcons({
      home,
      videocam,
      image,
      camera,
      trash,
      chatbox,
      exit,
      close,
      send,
      // chevron-down-circle-outline
      chevronDownCircleOutline,
    });
  }

  async showProfile(e: Event) {
    return this.utilsService.showPopover({
      component: ProfileComponent,
      cssClass: 'profile-popover',
      componentProps: {
        user: this.authService.user,
      },
      event: e,
      translucent: true,
    });
  }
}
