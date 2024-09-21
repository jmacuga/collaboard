"use client";

import { io, Socket } from "socket.io-client";

var socket: Socket;

if (typeof window !== "undefined") {
  socket = io();
}

export { socket };
