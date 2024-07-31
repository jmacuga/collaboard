import { createServer } from "node:http";
import { Server } from "socket.io";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 5001;

const httpServer = createServer();

const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("a user connected");
  socket.on("object-created", function (object) {
    console.log("received new object -> emiting to clients");
    io.emit("object-created", object);
  });
});

httpServer.listen(port, () => {
  console.log(`> Ready on http://${hostname}:${port}`);
});
