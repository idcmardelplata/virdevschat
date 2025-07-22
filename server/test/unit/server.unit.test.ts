/*TEST:
 * 1. Estructurar los mensajes que puede enviar el servidor
 * 2. poder serializar y deserializar esos mensajes
 */


import { WebSocket } from 'ws';
import { sendServerMessage } from '../../src/core/chat/messages';
import ConnectionManager from '../../src/core/chat/connectionManager';

describe('Structure the messages that will be sender from the server', () => {

  test("Structure welcome message", () => {
    const msg = JSON.parse(sendServerMessage("Welcome"));
    expect(msg.type).toBe("system");
    expect(msg.message).toBe("Bienvenido a virdevs chat!, escribe tus mensajes y presiona <enter>");
  });

  test("Structure presentation message", () => {
    const msg = JSON.parse(sendServerMessage("Presentation", 2));

    expect(msg.type).toBe("system");
    expect(msg.message).toBe(`Usuario se ha conectado. Total conectados 2`);
  });

  test("Structure disconnected message", () => {
    const msg = JSON.parse(sendServerMessage("Disconnected", 2));

    expect(msg.type).toBe("system");
    expect(msg.message).toBe(`Usuario se ha desconectado. Total conectados 2`);
  })
});

describe('Make a connection manager', () => {

  //HACK: Seria mas sensato crear un tipo de dato Client que almacene la IP, la cantidad de conexiones y los sockets.
  const wsClient = ({
    close: jest.fn(),
    send: jest.fn(),
    on: jest.fn(),
    readyState: WebSocket.OPEN
  });

  afterEach(() => {
    wsClient.close.mockReset()
    wsClient.on.mockReset()
    wsClient.send.mockReset()
  })

  test("Not allow more that 2 connections for ip", () => {

    const wsClient3 = { ...wsClient };
    const manager = new ConnectionManager(2);
    for (let i = 0; i < 3; i++) {
      manager.addConnection(wsClient, '10.10.12.127');
    }

    manager.addConnection(wsClient3, '10.10.12.127');
    expect(wsClient3.close).toHaveBeenCalled()
  })

  test.skip("Should send notifications about new user to all users in the chat", () => {

    const manager = new ConnectionManager(2);
    for (let i = 0; i < 10; i++) {
      manager.addConnection({ ...wsClient }, `168.254.0.${Math.random() * 254}`);
    }

    expect(manager.getClients().length).toBe(10);

    const randomClient = manager.getClients()[Math.round(Math.random() * 10)];
    expect(randomClient).toEqual({ ...wsClient });
    expect(randomClient.send).toHaveBeenCalled();
  })

  test.skip("Should notify when a client is disconnected", () => {
    const manager = new ConnectionManager(2);
    for (let i = 0; i < 10; i++) {
      manager.addConnection({ ...wsClient }, `168.254.0.${Math.random() * 254}`);
    }

    const randomClient = manager.getClients()[Math.round(Math.random() * 10)];
    const randomClient2 = manager.getClients()[Math.round(Math.random() * 2)];
    randomClient.close(1008);
    expect(randomClient2.send).toHaveBeenCalled();
  })
})
