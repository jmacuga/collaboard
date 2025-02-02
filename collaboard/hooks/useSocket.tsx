"use client";

import { useCallback, useContext } from "react";
import { useSession } from "next-auth/react";
import { SocketContext } from "../context/socketContext";
import { useEffect } from "react";
import { BoardContext } from "../context/boardContext";
import Konva from "konva";

const useSocket = ({ roomId }: { roomId: string }) => {
  const { data: session, status } = useSession();
  const { socket } = useContext(SocketContext);
  const { lines, setLines } = useContext(BoardContext);

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

  const addShapeEmit = ({ shape }: { shape: Object }) => {
    if (!socket || !roomId || !shape) return;
    socket.emit("add-shape", { roomId, shape });
  };

  const addShapeOn = useCallback(
    (shape: Konva.Shape) => {
      if (!shape) return;
      console.log("on addShape:", lines);
      lines.set(shape.id, shape);
      setLines(new Map(lines));
    },
    [lines]
  );

  useEffect(() => {
    socket.on("add-shape", addShapeOn);
    return () => {
      socket.on("add-shape", addShapeOn);
    };
  }, [socket, addShapeOn]);

  return { joinRoom, leaveRoom, addShapeEmit };
};

export { useSocket };
