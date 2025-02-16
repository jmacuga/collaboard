import { WebSocketServer } from "ws";
import { decode as cborXdecode } from "cbor-x";

function logMessages(wss: WebSocketServer) {
  wss.on("connection", (ws, request) => {
    console.log("Connection established");
    ws.on("message", (message) => {
      const decodedMessage = cborXdecode(message as Buffer);
      console.log("message", decodedMessage);
    });
  });
}
export { logMessages };
