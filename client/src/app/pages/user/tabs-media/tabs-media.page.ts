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
  IonButtons,
  IonMenuButton,
} from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { AuthService } from 'src/app/services/auth/auth.service';
import { HeaderComponent } from "../../../components/header/header.component";

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs-media.page.html',
  styleUrls: ['tabs-media.page.scss'],
  standalone: true,
  imports: [
    IonButtons,
    IonMenuButton,
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
    HeaderComponent
],
})
export class TabsMediaPage {
  protected authService = inject(AuthService);
}
