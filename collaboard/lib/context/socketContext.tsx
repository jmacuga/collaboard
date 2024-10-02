"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
} from "react";
import { io, Socket } from "socket.io-client";
import { Line, RoomContext, RoomUser, UserCursor } from "./roomContext";
import { Coming_Soon } from "next/font/google";
import { set } from "mongoose";

type Props = {
  children: React.ReactNode;
};

type ISocketContext = {
  socket: Socket;
};

export type UpdateRoomTypes = "update" | "history";

export type UpdateRoomPayload = {
  roomId: string;
  type: UpdateRoomTypes;
  data: Node[];
};

export type DeleteRoomNodesPayload = {
  roomId: string;
  data: {
    nodesToUpdate: Node[];
    nodesToDelete: Node[];
  };
};

export type UserJoinedPayload = {
  socketId: string;
  user: RoomUser;
};

export type GetUserMouseUpdatePayload = {
  socketId: string;
  userCursor: UserCursor;
};

export const SocketContext = createContext<ISocketContext>(
  {} as ISocketContext
);

var socket: Socket;

if (typeof window !== "undefined") {
  socket = io();
}
export const SocketContextProvider: React.FC<Props> = ({ children }) => {
  const connectionSuccess = () => {
    console.log("connection successful!");
  };
  const { lines, setLines } = useContext(RoomContext);
  const getRoomUsers = useCallback((payload: UserJoinedPayload[]) => {}, []);
  const userJoined = useCallback((payload: UserJoinedPayload) => {}, []);
  const userLeft = useCallback(({ socketId }: { socketId: string }) => {}, []);
  const getUserMouseUpdate = useCallback(
    (payload: GetUserMouseUpdatePayload) => {},
    []
  );

  const addShape = useCallback(
    (shape: Line) => {
      lines.set(shape.id, shape);
      setLines(new Map(lines));
    },
    [lines]
  );

  useEffect(() => {
    socket.on("connection-success", connectionSuccess);
    socket.on("get-room-users", getRoomUsers);
    socket.on("user-joined", userJoined);
    socket.on("user-left", userLeft);
    socket.on("get-user-mouse-update", getUserMouseUpdate);
    socket.on("add-shape", addShape);

    return () => {
      socket.off("connection-success", connectionSuccess);
      socket.off("get-room-users", getRoomUsers);
      socket.off("user-joined", userJoined);
      socket.off("user-left", userLeft);
      socket.off("get-user-mouse-update", getUserMouseUpdate);
    };
  }, [userJoined, userLeft, getUserMouseUpdate, getRoomUsers]);

  const value = useMemo(
    () => ({
      socket,
    }),
    []
  );
  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
};
