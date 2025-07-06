/*TEST:
 * 1. Estructurar los mensajes que puede enviar el servidor
 * 2. poder serializar y deserializar esos mensajes
 */


import { sendServerMessage } from '../../src/messages';

describe('Structure the messages that will be sender from the server', () => {

  test("Structure welcome message", () => {
    let msg = JSON.parse(sendServerMessage("Welcome"));
    expect(msg.type).toBe("system");
    expect(msg.message).toBe("Bienvenido a virdevs chat!, escribe tus mensajes y presiona <enter>");
  });

  test("Structure presentation message", () => {
    let msg = JSON.parse(sendServerMessage("Presentation", 2));

    expect(msg.type).toBe("system");
    expect(msg.message).toBe(`Usuario se ha conectado. Total conectados 2`);
  });

  test("Structure disconnected message", () => {
    let msg = JSON.parse(sendServerMessage("Disconnected", 2));

    expect(msg.type).toBe("system");
    expect(msg.message).toBe(`Usuario se ha desconectado. Total conectados 2`);
  })
});
