import { WebSocket } from "ws";
import { sendServerMessage } from './messages';

export default class ConnectionManager {
  private connections: Map<string, number> = new Map();
  private limit: number;
  clients: Set<WebSocket> = new Set();

  constructor(limit: number = 2) {
    this.limit = limit;
  }

  addConnection(ws, ip: string) {
    if (this.connections.get(ip) >= this.limit) {
      ws.close(1008, 'Limite de conexiones permitidas');
      return;
    }
    this.connections.set(ip, (this.connections.get(ip) || 0) + 1);
    this.clients.add(ws);
    //TODO: Combinar esto con la logica de sendServerMessage
    this.broadcast(sendServerMessage('Presentation', this.clients.size));
  }

  getClients() {
    return [...this.clients];
  }

  broadcast(message: {}) {
    let parsedMsg = JSON.stringify(message);
    for (const client of this.clients) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(parsedMsg);
      }
    }
  }

  remove(ws) {
    for (const socket of this.clients) {
      if (socket === ws) {
        this.clients.delete(socket);
        this.broadcast(sendServerMessage('Disconnected', this.clients.size))
      }
    }
  }
}
