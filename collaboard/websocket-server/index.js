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

  socket.on("object-created", function (object, canvasId, roomId) {
    console.log("received new object -> emiting to clients");
    io.emit("object-created", object, canvasId, roomId);
  });

  socket.on("object-moved", function (objId, left, top, canvasId, roomId) {
    console.log("received object moved -> emiting to clients");
    io.emit("object-moved", objId, left, top, canvasId, roomId);
  });

  socket.on("request-canvas", function (roomId, canvasId) {
    io.emit("request-canvas", roomId, canvasId);
  });

  socket.on("response-canvas", function (canvas, roomId, canvasId) {
    io.emit("response-canvas", canvas, roomId, canvasId);
  });
});

httpServer.listen(port, () => {
  console.log(`> Ready on http://${hostname}:${port}`);
});
