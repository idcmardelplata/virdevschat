import { GenericContainer, StartedTestContainer } from 'testcontainers';
import { WebSocket } from 'ws';

describe("ChatServer", () => {
  jest.setTimeout((1000 * 60) * 10); //Time for download the image in the ci or test environment
  let container: StartedTestContainer;
  let wsClient: WebSocket;

  beforeAll(async () => {
    const image_repository = "idcmardelplata/serverw";
    container = await new GenericContainer(image_repository)
      .withExposedPorts(8080, 8080)
      .start();
  })
  afterAll(async () => {
    if (wsClient.readyState === WebSocket.OPEN) {
      wsClient.close();
    }
    await container.stop();
  });

  beforeEach(done => {
    wsClient = new WebSocket(`ws://${container.getHost()}:${container.getMappedPort(8080)}`);
    wsClient.on('open', done);
  })

  afterEach(() => {
    if (wsClient.readyState == WebSocket.OPEN)
      wsClient.close();
  })

  test('Should connect with the chat server', (done) => {
    const websocket = new WebSocket(`ws://${container.getHost()}:${container.getMappedPort(8080)}`);
    websocket.on('open', done);
  });

  test('Receive a welcome message when you log in', done => {
    const greeterMsg = 'Bienvenido a virdevs chat!, escribe tus mensajes y presiona <enter>'

    wsClient.on('message', data => {
      const msg = JSON.parse(data.toString());
      const greeter = msg["message"];
      expect(greeter).toBe(greeterMsg);
      done();
    })
  });

  test("When more than one user connects, the system must notify that a new user has connected and show the number of connected users.", (done) => {
    const expectedEvents = [
      { type: "system", message: 'Bienvenido a virdevs chat!, escribe tus mensajes y presiona <enter>' },
      { type: "system", message: "Usuario se ha conectado. Total conectados 2" },
      { type: "system", message: "Usuario se ha desconectado. Total conectados 1" }
    ];
    const receivedEvents: object[] = [];

    const newCLient = new WebSocket(`ws://${container.getHost()}:${container.getMappedPort(8080)}`);
    newCLient.on('open', done);

    wsClient.on('message', data => {
      const parsedData = JSON.parse(data.toString());
      receivedEvents.push(parsedData);

      if (receivedEvents.length === expectedEvents.length) {
        expect(receivedEvents).toEqual(expectedEvents);
        done();
      }
    });
  })

  test('It should not allow more than 2 connections per IP.', done => {
    //NOTE: 'beforeEach' already connects a client before each test
    new WebSocket(`ws://${container.getHost()}:${container.getMappedPort(8080)}`);
    const client3 = new WebSocket(`ws://${container.getHost()}:${container.getMappedPort(8080)}`);

    client3.on('close', msg => {
      expect(msg).toBe(1008);
      done();
    });
  })
});
