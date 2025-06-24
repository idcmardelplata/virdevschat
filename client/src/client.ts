import { WebSocket } from 'ws';
import { createInterface } from 'node:readline';

// interfaz para leer la entrada del usuario desde la terminal
const rl = createInterface({
  input: process.stdin,
  output: process.stdout
});

// Conectar al servidor WebSocket
const ws = new WebSocket('ws://localhost:8080');

console.log('Conectando al servidor de chat...');


ws.on('open', () => {
  console.log('Conectado al servidor de chat');
  console.log('Escribe lo que quieras apreta Enter. Escribe "salir" para desconectarte.\n');

  // Empezar a escuchar input del usuario
  readInput();
});

ws.on('message', (data: any) => {
  try {
    const message = JSON.parse(data);
    switch (message.type) {
      case 'system':
        console.log(`\n Sistema: ${message.message}`)
        break;
      case 'message':
        console.log(`[${message.timestamp}]: ${message.texto}`)
        break;
      default:
        console.log(`Mensaje: ${message}`);
    }

    rl.prompt();
  } catch (error) {
    console.error(`Error al procesar el mensaje `, error);
  }
});



function readInput() {
  rl.setPrompt('Vos: ');
  rl.prompt();

  rl.on('line', (input) => {
    const texto = input.trim();

    // Comando para salir
    if (texto.toLowerCase() === 'salir') {
      console.log('Desconectando...');
      ws.close();
      return;
    }

    // No enviar mensajes vacíos
    if (texto === '') {
      rl.prompt();
      return;
    }

    // Enviar el mensaje al servidor
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({
        texto: texto
      }));
    } else {
      console.log('No hay conexión con el servidor');
    }

    rl.prompt();
  });
}

//Se lanza cuando presiono <C-c>
process.on('SIGINT', () => {
  console.log(`\n Saliendo...`);
  ws.close();
  rl.close();
  process.exit(0);
});
