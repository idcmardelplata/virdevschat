"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ws_1 = require("ws");
var node_readline_1 = require("node:readline");
// interfaz para leer la entrada del usuario desde la terminal
var rl = (0, node_readline_1.createInterface)({
    input: process.stdin,
    output: process.stdout
});
// Conectar al servidor WebSocket
var ws = new ws_1.WebSocket('ws://localhost:8080');
console.log('Conectando al servidor de chat...');
ws.on('open', function () {
    console.log('Conectado al servidor de chat');
    console.log('Escribe lo que quieras apreta Enter. Escribe "salir" para desconectarte.\n');
    // Empezar a escuchar input del usuario
    readInput();
});
ws.on('message', function (data) {
    try {
        var message = JSON.parse(data);
        switch (message.type) {
            case 'system':
                console.log("\n Sistema: ".concat(message.message));
                break;
            case 'message':
                console.log("[".concat(message.timestamp, "]: ").concat(message.texto));
                break;
            default:
                console.log("Mensaje: ".concat(message));
        }
        rl.prompt();
    }
    catch (error) {
        console.error("Error al procesar el mensaje ", error);
    }
});
function readInput() {
    rl.setPrompt('Vos: ');
    rl.prompt();
    rl.on('line', function (input) {
        var texto = input.trim();
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
        if (ws.readyState === ws_1.WebSocket.OPEN) {
            ws.send(JSON.stringify({
                texto: texto
            }));
        }
        else {
            console.log('No hay conexión con el servidor');
        }
        rl.prompt();
    });
}
//Se lanza cuando presiono <C-c>
process.on('SIGINT', function () {
    console.log("\n Saliendo...");
    ws.close();
    rl.close();
    process.exit(0);
});
