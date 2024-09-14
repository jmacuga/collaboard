import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";
import dbConnect from "./socket_server/dbConnect.js";
import { addObjectToCanvas } from "./socket_server/data.js";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;

const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(handler);
  console.log("server created");
  dbConnect();

  const io = new Server(httpServer);

  io.on("connection", (socket) => {
    console.log("a user connected");

    socket.on("joined-room", function (roomId) {
      console.log("user joined room: ", roomId);
      socket.join(roomId);
    });

    socket.on("object-created", function (object, roomId, canvasId) {
      console.log("received new object -> emiting to clients");
      io.to(roomId).emit("object-created", object, socket.id);
      console.log("Canvas ID: ", canvasId);
      addObjectToCanvas({ object, canvasId });
    });

    socket.on("object-moved", function (objId, left, top, canvasId, roomId) {
      console.log("received object moved -> emiting to clients");
      io.to(roomId).emit("object-moved", objId, left, top, canvasId, roomId);
    });

    socket.on("request-canvas", function (roomId, canvasId) {
      io.to(roomId).emit("request-canvas", roomId, canvasId);
    });

    socket.on("response-canvas", function (canvas, roomId, canvasId) {
      io.to(roomId).emit("response-canvas", canvas, roomId, canvasId);
    });
  });

  httpServer
    .once("error", (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
});
