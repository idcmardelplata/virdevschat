import { RawData } from 'ws';
import ConnectionManager from './connectionManager';
import { IncomingMessage } from 'node:http';

export class ChatServer {
  private server;
  private manager: ConnectionManager;

  constructor(socket) {
    this.server = socket;
    this.manager = new ConnectionManager(2);
    console.log(`ChatServer running at port ${socket.options.port}`)
  }

  run() {
    this.server.on('connection', (ws: any, req: IncomingMessage): void => {
      let ip = req.socket.remoteAddress ?? "";
      this.manager.addConnection(ws, ip);
      console.log("Un nuevo usuario se ha conectado.")

      this.handle_messages(ws);
      this.handle_close(ws);
      this.handle_errors(ws);
    });
  }
  private handle_messages(ws) {
    ws.on('message', (data: RawData) => {

      try {
        const message = JSON.parse(data.toString());
        this.manager.broadcast({
          type: 'message',
          texto: message.texto,
          timestamp: new Date().toLocaleTimeString()
        })
      } catch (error) {
        console.error(`Error al procesar mensaje`, error);
      }
    });
  }

  private handle_close(ws) {
    ws.on('close', () => {
      console.log(`Cliente desconectado`);
    })
  }
  private handle_errors(ws) {
    ws.on('error', (error) => {
      console.error(`Error en el websocket ${error}`);
    })
  }
}
