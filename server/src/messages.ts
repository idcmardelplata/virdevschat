
type MessageType = "Welcome" | "Presentation" | "Disconnected" | "message";

export function sendServerMessage(type: MessageType, quantity: number = 0) {
  const systemMessages = {
    "Welcome": "Bienvenido a virdevs chat!, escribe tus mensajes y presiona <enter>",
    "Presentation": `Usuario se ha conectado. Total conectados ${quantity}`,
    "Disconnected": `Usuario se ha desconectado. Total conectados ${quantity}`
  }

  function getServerMessage(type: MessageType): string {
    return JSON.stringify({
      type: 'system',
      message: systemMessages[type]
    })
  }
  return getServerMessage(type);
};
