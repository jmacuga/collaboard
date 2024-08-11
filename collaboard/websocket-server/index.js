import { createServer } from "node:http";
import { Server } from "socket.io";

const dev = process.env.NODE_ENV !== "production";
const hostname = "app";
const port = 4000;

const httpServer = createServer();

const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("object-created", function (object, canvasId) {
    console.log(object);
    console.log("received new object -> emiting to clients");
    io.emit("object-created", object, canvasId);
  });

  socket.on("object-moved", function (objId, left, top, canvasId) {
    console.log("received object moved -> emiting to clients");
    io.emit("object-moved", objId, left, top, canvasId);
  });
});

httpServer.listen(port, () => {
  console.log(`> Ready on http://${hostname}:${port}`);
});
