import { WebSocket } from 'ws';
import ConnectionManager from './core/chat/connectionManager';
import { OpenFeature } from '@openfeature/server-sdk';
import { ChatServer } from './core/chat';
import dotenv from 'dotenv';
import { EnvVarProvider } from '@openfeature/env-var-provider';

try {
  dotenv.config();
  OpenFeature.setProvider(new EnvVarProvider())

} catch (error) {
  console.error(`Failed to initialize EnvVarProvider: ${error}`);
}

const client = OpenFeature.getClient();

async function startServer() {
  if (await client.getBooleanValue('server-refactor', false)
    && await client.getObjectValue('environment', { env: 'dev' })) {

    console.log("New version of the server");
    const chatServer = new ChatServer(new WebSocket.Server({ port: 8080 }))
    chatServer.run();

  } else {
    //NOTE: Codigo legacy a cambiar

    console.log(`This flag should be tested and delete`);

    const server = new WebSocket.Server({
      port: 8080,
    });
    const manager = new ConnectionManager(2);

    console.log("Server running at: 8080");

    server.on("connection", (ws, req) => {
      const ip = req.socket.remoteAddress ?? "";
      manager.addConnection(ws, ip);

      ws.on("message", (data: string) => {
        try {
          const mensaje = JSON.parse(data);
          console.log(`Mensaje recibido: ${mensaje.texto}`);

          manager.broadcast({
            type: "message",
            texto: mensaje.texto,
            timestamp: new Date().toLocaleTimeString(),
          });
        } catch (err) {
          console.error(`Error al procesar mensaje`, err);
        }
      });

      ws.on("close", () => {
        const ip = req.socket.remoteAddress ?? "";
        console.log(`Cliente desconectado`);
        manager.remove(ws, ip);
      });

      ws.on("error", (error) => {
        console.error(`Error en el websocket`, error);
      });
    });
  }
}

startServer();
