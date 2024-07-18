import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

import { Socket, Server } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class DriveGateway {
  @WebSocketServer() private readonly server: Server;

  @SubscribeMessage('join')
  handleJoin(@MessageBody() uuid: string, @ConnectedSocket() socket: Socket) {
    socket.join(uuid);
  }

  @SubscribeMessage('leave')
  handleLeave(@MessageBody() uuid: string, @ConnectedSocket() socket: Socket) {
    socket.leave(uuid);
  }

  emitProgress(uuid: string, progress: number) {
    this.server.to(uuid).emit('progress', progress);
  }
}
