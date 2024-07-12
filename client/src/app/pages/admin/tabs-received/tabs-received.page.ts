import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonTabs,
  IonTabBar,
  IonTabButton,
  IonIcon,
  IonLabel,
} from '@ionic/angular/standalone';
import { HeaderComponent } from "../../../components/header/header.component";

@Component({
  selector: 'app-tabs-received',
  templateUrl: './tabs-received.page.html',
  styleUrls: ['./tabs-received.page.scss'],
  standalone: true,
  imports: [
    IonLabel,
    IonIcon,
    IonTabButton,
    IonTabBar,
    IonTabs,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    HeaderComponent
],
})
export class TabsReceivedPage {}
