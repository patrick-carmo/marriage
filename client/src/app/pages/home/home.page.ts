import { CUSTOM_ELEMENTS_SCHEMA, Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import { register } from 'swiper/element/bundle';
import { HomeComponent } from 'src/app/components/home/home.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [HomeComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class HomePage implements OnInit {
  photos: any[] = [];

  constructor(readonly authService: AuthService) {
    register();
  }

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
  }
}
