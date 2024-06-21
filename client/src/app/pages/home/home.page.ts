import { CUSTOM_ELEMENTS_SCHEMA, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonButton, IonText } from '@ionic/angular/standalone';
import { RouterLink } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { register } from 'swiper/element/bundle';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss', '../../app.component.scss'],
  standalone: true,
  imports: [
    IonText,
    IonButton,
    IonContent,
    CommonModule,
    FormsModule,
    RouterLink,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class HomePage {
  protected photos = [
    '../../../assets/img/20240616_155125.jpg',
    '../../../assets/img/20240616_162002.jpg',
    '../../../assets/img/20240616_170641.jpg',
    '../../../assets/img/20240616_171404.jpg',
    '../../../assets/img/20240616_173459.jpg',
    '../../../assets/img/20240616_174528.jpg',
  ];

  constructor(readonly authService: AuthService) {
    register();
  }

  loginOrLogout() {
    if (!this.authService.user) {
      window.open(this.authService.loginOrLogoutURL, '_self');
      return;
    }

    this.authService.logout();
  }
}
