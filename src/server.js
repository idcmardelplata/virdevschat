"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ws_1 = require("ws");
var server = new ws_1.WebSocket.Server({
    port: 8080,
    // verifyClient: client => {
    //   const allowOrigins = ['wss://server.com', 'wss://chat.server.com'];
    //   return allowOrigins.includes(client.origin);
    // }
});
console.log("Server running at: 8080");
var clients = [];
var connections = {};
server.on('connection', function (ws, req) {
    var _a;
    // Limitar las conexiones por IP
    var ip = (_a = req.socket.remoteAddress) !== null && _a !== void 0 ? _a : ""; //Si es undefined retorna un string vacio.
    connections[ip] = (connections[ip] || 0) + 1;
    if (connections[ip] > 2) {
        ws.close(1008, "Limite de conexiones permitidas");
        return;
    }
    console.log("Nuevo usuario conectado");
    clients.push(ws);
    ws.send(JSON.stringify({
        type: 'system',
        message: 'Bienvenido a virdevs chat!, escribe tus mensajes y presiona <enter>'
    }));
    broadcast({
        type: 'system',
        message: "Usuario se ha conectado. Total conectados ".concat(clients.length)
    }, ws); // Excluye a este cliente
    ws.on('message', function (data) {
        try {
            //parseamos el mensaje recibido
            var mensaje = JSON.parse(data);
            console.log("Mensaje recibido: ".concat(mensaje.texto));
            // Enviar a todos los conectados
            broadcast({
                type: 'message',
                texto: mensaje.texto,
                timestamp: new Date().toLocaleTimeString()
            }, undefined);
        }
        catch (err) {
            console.error("Error al procesar mensaje", err);
        }
    });
    //cuando un cliente se desconecta
    ws.on('close', function () {
        console.log("Cliente desconectado");
        var index = clients.indexOf(ws);
        if (index > -1) {
            clients.splice(index, 1);
        }
        connections[ip]--;
        broadcast({
            type: 'system',
            message: "Usuario se ha desconectado. Total conectados ".concat(clients.length)
        }, undefined);
        ws.on('error', function (error) {
            console.error("Error en el websocket", error);
        });
    });
    function broadcast(mensaje, excluir) {
        var msgJson = JSON.stringify(mensaje);
        console.log(msgJson);
        clients.forEach(function (client) {
            if (client.readyState === ws_1.WebSocket.OPEN && client !== excluir) {
                client.send(msgJson);
            }
        });
    }
});
