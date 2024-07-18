import { Injectable, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs';
import { Socket, io } from 'socket.io-client';

@Injectable({
  providedIn: 'root',
})
export class WebsocketService implements OnDestroy {
  private socket: Socket | null = null;

  ngOnDestroy() {
    this.disconnect();
  }

  connect() {
    if (!this.socket) this.socket = io(import.meta.env['NG_APP_SERVER']);
  }

  disconnect() {
    this.socket?.close();
    this.socket = null;
  }

  progress() {
    return new Observable((sub: any) => {
      this.socket?.on('progress', (data) => sub.next(data));

      return () => {
        this.socket?.off('progress');
        this.disconnect();
      };
    });
  }

  emit(eventName: string, data: any) {
    this.socket?.emit(eventName, data);
  }
}
