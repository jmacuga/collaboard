import { createServer } from "http";
import { WebSocketServer } from "ws";
import { parse } from "url";
import next from "next";

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

  // Create WebSocket server with a path
  const wss = new WebSocketServer({
    noServer: true,
  });

  // Handle upgrade requests
  server.on("upgrade", (request, socket, head) => {
    const pathname = new URL(request.url!, `http://${request.headers.host}`)
      .pathname;

    if (pathname === "/_next/webpack-hmr") {
      // Skip handling HMR WebSocket - let Next.js handle it internally
      return;
    }

    if (pathname === "/api/socket") {
      wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit("connection", ws, request);
      });
      return;
    }

    // If neither path matches, destroy the connection
    socket.destroy();
  });

  wss.on("connection", (ws) => {
    console.log("Client connected");

    ws.on("message", (message) => {
      console.log("Received:", message.toString());
    });

    ws.on("close", () => {
      console.log("Client disconnected");
    });

    ws.send("Connected to WebSocket server");
  });

  server.listen(port, () => {
    console.log(`> Ready on http://${hostname}:${port}`);
    console.log(
      `> WebSocket server is running on ws://${hostname}:${port}/api/socket`
    );
  });
});
