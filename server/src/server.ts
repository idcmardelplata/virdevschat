import { WebSocket } from 'ws';
import ConnectionManager from './connectionManager';
import { OpenFeature } from '@openfeature/server-sdk';
import { FlagdProvider } from '@openfeature/flagd-provider';

try {
  OpenFeature.setProviderAndWait(new FlagdProvider());
} catch (error) {
  console.error(`Failed to initialize FlagdProvider: ${error}`);
}

const client = OpenFeature.getClient();
const refactoring_server = client.getBooleanValue('refactor-server', true);


refactoring_server.then(result => {
  if (result) {
    console.log(`Server en plena refactorizacion.`);
    process.exit(0);

  } else {
    const server = new WebSocket.Server({
      port: 8080,
    });
    const manager = new ConnectionManager(2);

    console.log("Server running at: 8080");

    server.on('connection', (ws, req) => {
      let ip = req.socket.remoteAddress ?? "";
      manager.addConnection(ws, ip);

      ws.on('message', (data: any) => {
        try {
          const mensaje = JSON.parse(data);
          console.log(`Mensaje recibido: ${mensaje.texto}`)

          manager.broadcast({
            type: 'message',
            texto: mensaje.texto,
            timestamp: new Date().toLocaleTimeString()
          })

        } catch (err) {
          console.error(`Error al procesar mensaje`, err);
        }

      });

      ws.on('close', () => {
        console.log(`Cliente desconectado`);
        manager.remove(ws);
      });


      ws.on('error', error => {
        console.error(`Error en el websocket`, error);
      });

    });

  }



})

