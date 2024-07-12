import { Component, inject } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import {
  IonHeader,
  IonToolbar,
  IonButtons,
  IonChip,
  IonAvatar,
  IonLabel,
  IonButton,
  IonIcon,
  IonMenuButton,
} from '@ionic/angular/standalone';
import { UtilsService } from 'src/app/services/utils.service';
import { ProfileComponent } from '../profile/profile.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
  imports: [
    IonIcon,
    IonButton,
    IonMenuButton,
    IonLabel,
    IonAvatar,
    IonChip,
    IonButtons,
    IonToolbar,
    IonHeader,
    CommonModule,
  ],
})
export class HeaderComponent {
  protected readonly authService = inject(AuthService);
  protected readonly utilsService = inject(UtilsService);

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
