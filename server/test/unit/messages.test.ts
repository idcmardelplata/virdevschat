// Estructurar los mensajes que puede enviar el servidor.
import { sendServerMessage } from '../../src/core/chat/messages';


describe('Structure the messages that will be sender from the server', () => {

  test("Structure welcome message", () => {
    let msg = JSON.parse(sendServerMessage("Welcome"));
    expect(msg.type).toBe("system");
    expect(msg.message).toBe('Bienvenido a virdevs chat!, escribe tus mensajes y presiona <enter>');
  });

  test("Structure presentation message", () => {
    let msg = JSON.parse(sendServerMessage("Presentation"));
    expect(msg.type).toBe("system");
    expect(msg.message).toBe(`Usuario se ha conectado. Total conectados ${0}`);
  });

  test("Structure presentation message", () => {
    let msg = JSON.parse(sendServerMessage("Disconnected"));
    expect(msg.type).toBe("system");
    expect(msg.message).toBe(`Usuario se ha desconectado. Total conectados ${0}`)
  });

});
