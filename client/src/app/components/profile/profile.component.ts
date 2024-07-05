import { Component, Input, OnInit } from '@angular/core';
import {
  IonCard,
  IonCardTitle,
  IonCardHeader,
  IonCardSubtitle,
  IonCardContent,
  IonAvatar,
} from '@ionic/angular/standalone';
import { User } from 'src/app/types/interfaces';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  standalone: true,
  imports: [
    IonAvatar,
    IonCardContent,
    IonCardSubtitle,
    IonCardHeader,
    IonCardTitle,
    IonCard,
  ],
})
export class ProfileComponent implements OnInit {
  @Input() user: User | null = null;
  constructor() {}

  ngOnInit() {}
}
