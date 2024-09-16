"use client";

import { ScissorsIcon } from "@heroicons/react/24/outline";
import { io, Socket } from "socket.io-client";

var socket: Socket;

if (typeof window !== "undefined") {
  socket = io(); // Replace with your server URL
}

export { socket };
