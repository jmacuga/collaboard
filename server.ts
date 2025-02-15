import { createServer } from "http";
import { WebSocketServer } from "ws";
import { parse } from "url";
import next from "next";
import "./polyfill";
import { createAutomergeServer } from "@/lib/automerge-server";
const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = parseInt(process.env.PORT || "3000", 10);
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = createServer((req, res) => {
    const parsedUrl = parse(req.url!, true);
    handle(req, res, parsedUrl).catch((err) => {
      console.error("Error occurred handling", req.url, err);
      res.statusCode = 500;
      res.end("Internal Server Error");
    });
  });

  const wss = new WebSocketServer({
    noServer: true,
  });

  createAutomergeServer(wss, hostname);

  server.on("upgrade", (request, socket, head) => {
    if (!request.url) return socket.destroy();

    const { pathname } = parse(request.url);

    if (pathname === "/_next/webpack-hmr") {
      return;
    }

    if (pathname === "/api/socket") {
      wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit("connection", ws, request);
      });
      return;
    }

    socket.destroy();
  });

  server.listen(port, () => {
    console.log(`> Ready on http://${hostname}:${port}`);
    console.log(
      `> WebSocket server is running on ws://${hostname}:${port}/api/socket`
    );
  });
});
