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
  IonText,
} from '@ionic/angular/standalone';
import { CommonModule, NgOptimizedImage } from '@angular/common';

import { PhotoCard } from 'src/app/types/interfaces';
import { HeaderComponent } from 'src/app/components/header/header.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [
    HeaderComponent,
    IonContent,
    IonCardHeader,
    IonCardTitle,
    IonButton,
    IonCardContent,
    CommonModule,
    IonCard,
    RouterLink,
    IonText,
    NgOptimizedImage,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class HomePage implements OnInit {
  protected readonly authService = inject(AuthService);

  protected photos: PhotoCard[] = [];

  protected paragraphs = [
    `Que alegria tê-los aqui para celebrar conosco este dia tão especial! Para tornar este momento ainda mais inesquecível, convidamos vocês a gravar uma mensagem de carinho para os noivos.`,

    `Sua mensagem é um presente único e especial que os noivos vão adorar receber. A mensagem será guardada para sempre e os noivos poderão ouvi-la quantas vezes quiserem.`,

    `Esperamos que você se divirta gravando sua mensagem e obrigado por participar deste momento tão importante!`,
  ];

  ngOnInit() {
    this.photos = [
      {
        src: '../../../../assets/img/couple/img1.jpg',
        title: 'O Início',
        content:
          'Foi em 2018 que nossas histórias se cruzaram e, desde então, não nos separamos mais.',
      },
      {
        src: '../../../../assets/img/couple/img2.jpg',
        title: 'O Pedido',
        content:
          'Em 2022 com o coração transbordando de amor, selamos nosso compromisso com um pedido de noivado.',
      },
      {
        src: '../../../../assets/img/couple/img3.jpg',
        title: 'O Casamento',
        content:
          'E finalmente, o grande dia chegou! No dia 14 de julho diremos "sim" um ao outro e iniciaremos um novo capítulo em nossas vidas.',
      },
    ];
  }

  protected login() {
    window.open(this.authService.loginURL, '_self');
  }
}
