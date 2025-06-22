import { WebSocket } from 'ws';


const server = new WebSocket.Server({
  port: 8080,
  // verifyClient: client => {
  //   const allowOrigins = ['wss://server.com', 'wss://chat.server.com'];
  //   return allowOrigins.includes(client.origin);
  // }
});
console.log("Server running at: 8080");

const clients: any[] = [];
const connections: any = {};

server.on('connection', (ws, req) => {
  // Limitar las conexiones por IP
  const ip: string = req.socket.remoteAddress ?? ""; //Si es undefined retorna un string vacio.
  connections[ip] = (connections[ip] || 0) + 1;

  if (connections[ip] > 2) {
    ws.close(1008, "Limite de conexiones permitidas");
    return;
  }

  console.log(`Nuevo usuario conectado`);
  clients.push(ws);


  ws.send(JSON.stringify({
    type: 'system',
    message: 'Bienvenido a virdevs chat!, escribe tus mensajes y presiona <enter>'
  }));


  broadcast({
    type: 'system',
    message: `Usuario se ha conectado. Total conectados ${clients.length}`
  }, ws); // Excluye a este cliente


  ws.on('message', (data: any) => {
    try {
      //parseamos el mensaje recibido
      const mensaje = JSON.parse(data);
      console.log(`Mensaje recibido: ${mensaje.texto}`)

      // Enviar a todos los conectados
      broadcast({
        type: 'message',
        texto: mensaje.texto,
        timestamp: new Date().toLocaleTimeString()
      }, undefined);

    } catch (err) {
      console.error(`Error al procesar mensaje`, err);
    }

  });

  //cuando un cliente se desconecta
  ws.on('close', () => {
    console.log(`Cliente desconectado`);

    const index = clients.indexOf(ws);
    if (index > -1) {
      clients.splice(index, 1);
    }

    connections[ip]--;

    broadcast({
      type: 'system',
      message: `Usuario se ha desconectado. Total conectados ${clients.length}`
    }, undefined);

    ws.on('error', error => {
      console.error(`Error en el websocket`, error);
    });

  });

  function broadcast(mensaje: {}, excluir: WebSocket | undefined) {
    const msgJson = JSON.stringify(mensaje);
    console.log(msgJson);

    clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN && client !== excluir) {
        client.send(msgJson);
      }
    });
  }
});
