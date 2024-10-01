"use client";

import { useCallback, useContext } from "react";
import { RoomContext } from "../context/roomContext";
import { useSession } from "next-auth/react";
import { SocketContext } from "../context/socketContext";
import Konva from "konva";
const useSocket = ({ roomId }: { roomId: string }) => {
  const { data: session, status } = useSession();

  const { socket } = useContext(SocketContext);

  const joinRoom = useCallback(() => {
    if (!socket || !roomId || !session || !session.user) return;
    socket.emit("join-room", {
      roomId,
      user: {
        id: session.user.id,
      },
    });
  }, [socket, roomId, session]);

  const leaveRoom = useCallback(() => {
    if (!socket || !roomId) return;
    socket.emit("leave-room", { roomId });
  }, [socket, roomId]);

  const addShape = useCallback(
    ({ shape }: { shape: Object }) => {
      if (!socket || !roomId) return;
      socket.emit("add-shape", { roomId, shape });
    },
    [socket, roomId]
  );

  return { joinRoom, leaveRoom, addShape };
};

export { useSocket };
