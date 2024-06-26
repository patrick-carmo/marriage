import { CommonModule } from '@angular/common';
import {
  CUSTOM_ELEMENTS_SCHEMA,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import {
  IonCard,
  IonCardContent,
  IonButton,
  IonCardTitle,
  IonCardHeader,
} from '@ionic/angular/standalone';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-home-component',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: true,
  imports: [
    IonCardHeader,
    IonCardTitle,
    IonButton,
    IonCardContent,
    CommonModule,
    IonCard,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class HomeComponent implements OnInit {
  @Input() photos: any[] = [];

  constructor(readonly authService: AuthService) {}

  ngOnInit() {}

  loginOrLogout() {
    if (!this.authService.user) {
      window.open(this.authService.loginOrLogoutURL, '_self');
      return;
    }

    this.authService.logout();
  }
}
