import { Component, inject } from '@angular/core';
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
import { camera, chatbox, home, image, trash, videocam } from 'ionicons/icons';
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
  protected authService = inject(AuthService);

  constructor() {
    addIcons({ home, videocam, image, camera, trash, chatbox });
  }
}
