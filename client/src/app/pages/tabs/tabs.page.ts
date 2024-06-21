import { Component } from '@angular/core';
import {
  IonTabs,
  IonTabBar,
  IonTabButton,
  IonIcon,
  IonLabel,
  IonButton,
  IonAvatar,
  IonChip,
  IonToolbar,
  IonHeader,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { home, videocam } from 'ionicons/icons';
import { CommonModule } from '@angular/common';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
  standalone: true,
  imports: [
    IonHeader,
    IonToolbar,
    IonChip,
    IonAvatar,
    IonButton,
    IonTabs,
    IonTabBar,
    IonTabButton,
    IonIcon,
    IonLabel,
    CommonModule,
  ],
})
export class TabsPage {
  constructor(protected readonly authService: AuthService) {
    addIcons({ home, videocam });
  }

  loginOrLogout() {
    if (!this.authService.user) {
      window.open(this.authService.loginOrLogoutURL, '_self');
      return;
    }

    this.authService.logout();
  }
}
