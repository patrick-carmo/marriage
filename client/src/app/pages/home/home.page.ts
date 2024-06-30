import { RouterLink } from '@angular/router';
import {
  CUSTOM_ELEMENTS_SCHEMA,
  Component,
  OnInit,
  inject,
} from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import {
  IonContent,
  IonCardHeader,
  IonCardTitle,
  IonButton,
  IonCardContent,
  IonCard,
} from '@ionic/angular/standalone';
import { CommonModule, NgOptimizedImage } from '@angular/common';

import { Photos } from 'src/app/types/interfaces';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonCardHeader,
    IonCardTitle,
    IonButton,
    IonCardContent,
    CommonModule,
    IonCard,
    RouterLink,
    NgOptimizedImage,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class HomePage implements OnInit {
  protected readonly authService = inject(AuthService);

  photos: Photos[] = [];

  ngOnInit() {
    this.photos = [
      {
        src: '../../../assets/img/couple/img1.jpg',
        title: 'O Início',
        content:
          'Nos conhecemos em 2015, na faculdade. Desde então, estamos juntos e felizes.',
      },
      {
        src: '../../../assets/img/couple/img2.jpg',
        title: 'O Pedido',
        content:
          'Em 2019, fiz o pedido de casamento. Foi um momento muito especial.',
      },
      {
        src: '../../../assets/img/couple/img3.jpg',
        title: 'O Casamento',
        content: 'O casamento será em 2021. Estamos muito felizes e ansiosos.',
      },
    ];

    const cardTitle = document.getElementById('title');

    if (cardTitle) {
      if (this.authService.user) cardTitle.style.paddingTop = '90px';
      else cardTitle.style.paddingTop = '';
    }
  }

  login() {
    window.open(this.authService.loginURL, '_self');
  }
}
