import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

import { Socket, Server } from 'socket.io';

@WebSocketGateway()
export class DriveGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() private readonly server: Server;

  @SubscribeMessage('progress')
  handleMessage(@MessageBody() body: any, @ConnectedSocket() socket: Socket) {
    console.log({ client: socket.id, body });
  }

  emitProgress(uuid: string, progress: number) {
    this.server.emit('progress', { uuid, progress });
  }

  handleConnection(client: Socket) {
    console.log('Client connected: ', client.id);
  }

  handleDisconnect(client: Socket) {
    console.log('Client disconnected: ', client.id);
  }
}
