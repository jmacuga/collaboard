import { createServer } from "http";
import { WebSocketServer } from "ws";
import { parse } from "url";
import next from "next";
import { createAutomergeServer } from "@/lib/automerge-server";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;

// Initialize Next.js
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  // Create HTTP server
  const server = createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url!, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error("Error occurred handling", req.url, err);
      res.statusCode = 500;
      res.end("Internal Server Error");
    }
  });

  const wss = new WebSocketServer({
    noServer: true,
  });

  createAutomergeServer(wss, hostname);

  server.on("upgrade", (request, socket, head) => {
    const pathname = new URL(request.url!, `http://${request.headers.host}`)
      .pathname;

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
