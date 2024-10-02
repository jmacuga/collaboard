import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";
import dbConnect from "./socket_server/dbConnect.js";
import { addObjectToStage } from "./socket_server/data.js";

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

    socket.on("add-shape", function ({ shape, roomId }) {
      socket.to(roomId).emit("add-shape", shape);
      addObjectToStage({ object: shape, roomId: roomId });
    });

    socket.on("join-room", function ({ roomId, user }) {
      socket.join(roomId);
    });

    // socket.on("object-created", function (object, roomId) {
    //   console.log("received new object -> emiting to clients");
    //   socket.to(roomId).emit("object-created", object, socket.id);
    //   addObjectToCanvas({ object, roomId });
    // });

    socket.on("object-moved", function (objId, left, top, roomId) {
      console.log("received object moved -> emiting to clients");
      socket.to(roomId).emit("object-moved", objId, left, top);
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
