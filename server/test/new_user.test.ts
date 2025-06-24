
describe('A new user arrived', () => {
  it('new user instance creation', () => {
    /* TEST:
     * Cuando el servidor escucha el evento 
     * 'connection' se debe crear una nueva
     * instancia del usuario (pasandole el socket como argumento).
     * La instancia debe ser generada internamente por
     * el US Chat.
     */
    expect({}).toBeFalsy();
  })

  it.todo("Should create a new user when new connection is registered")
});
