import { GenericContainer, StartedTestContainer } from 'testcontainers';
import { WebSocket } from 'ws';
//Should connect with the server
//receive a wellcome message when your log in.

describe("ChatServer", () => {
  jest.setTimeout((1000 * 60) * 10)
  let container: StartedTestContainer;
  let wsClient: WebSocket;


  beforeAll(async () => {
    const image_repository = "idcmardelplata/serverw";
    container = await new GenericContainer(image_repository)
      .withExposedPorts(8080, 8080)
      .start();
  });

  afterAll(async () => {
    if (wsClient.readyState === WebSocket.OPEN) {
      wsClient.close()
    }
    await container.stop();
  })

  beforeEach((done) => {
    wsClient = new WebSocket(`ws://${container.getHost()}:${container.getMappedPort(8080)}`);
    wsClient.on('open', done);
  });

  afterEach(() => {
    if (wsClient.readyState === WebSocket.OPEN) {
      wsClient.close()
    }
  })

  test("Should connect with the server", (done) => {
    const websocket = new WebSocket(`ws://${container.getHost()}:${container.getMappedPort(8080)}`);
    websocket.on('open', done);
  })

  test("receive a wellcome message when your log in.", done => {
    const greeterMsg = 'Bienvenido a virdevs chat!, escribe tus mensajes y presiona <enter>';
    wsClient.on('message', data => {
      const msg = JSON.parse(data.toString());
      const greeter = msg["message"];
      expect(greeter).toBe(greeterMsg);
      done();
    })
    done();
  });

  test("It Should not allow than 2 connections peer ip", (done) => {
    new WebSocket(`ws://${container.getHost()}:${container.getMappedPort(8080)}`);
    const client3 = new WebSocket(`ws://${container.getHost()}:${container.getMappedPort(8080)}`);

    client3.on('close', msg => {
      expect(msg).toBe(1008);
      done();
    })
  });






})
