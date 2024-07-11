import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  IonTextarea,
  IonFooter,
  IonHeader,
  IonToolbar,
  IonButton,
  IonButtons,
  IonTitle,
  IonContent,
  IonText,
  IonList,
  IonAvatar,
  IonItem,
  IonLabel,
  IonIcon,
  IonInput,
  ModalController,
  IonChip,
} from '@ionic/angular/standalone';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-modal-comment',
  templateUrl: './comment-modal.component.html',
  styleUrls: ['./comment-modal.component.scss'],
  standalone: true,
  imports: [
    IonChip,
    IonAvatar,
    CommonModule,
    FormsModule,
    IonInput,
    IonIcon,
    IonLabel,
    IonItem,
    IonList,
    IonText,
    IonContent,
    IonTitle,
    IonButtons,
    IonButton,
    IonToolbar,
    IonHeader,
    IonFooter,
    IonTextarea,
  ],
})
export class CommentModalComponent {
  private readonly modalController = inject(ModalController);
  private readonly utilsService = inject(UtilsService);

  @Input() protected picture = '';

  @Input() protected comment: string = '';
  @Input() protected maxLength: number = 250;
  @Input() protected minLength: number = 10;

  cancel() {
    return this.modalController.dismiss(null, 'cancel');
  }

  confirm() {
    if (!this.comment) {
      return this.utilsService.showToast({
        message: 'Por favor, insira uma mensagem.',
      });
    }

    if (this.comment.length < this.minLength) {
      return this.utilsService.showToast({
        message: `A mensagem deve ter no mínimo ${this.minLength} caracteres.`,
      });
    }

    if (this.comment.length > this.maxLength) {
      return this.utilsService.showToast({
        message: `A mensagem deve ter no máximo ${this.maxLength} caracteres.`,
      });
    }

    return this.modalController.dismiss(this.comment, 'confirm');
  }
}
