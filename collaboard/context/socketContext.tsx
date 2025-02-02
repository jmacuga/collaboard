"use client";

import React, { createContext, useCallback, useEffect, useMemo } from "react";
import { io, Socket } from "socket.io-client";
import { RoomUser, UserCursor } from "./boardContext";

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
  const getRoomUsers = useCallback((payload: UserJoinedPayload[]) => {}, []);
  const userJoined = useCallback((payload: UserJoinedPayload) => {}, []);
  const userLeft = useCallback(({ socketId }: { socketId: string }) => {}, []);
  const getUserMouseUpdate = useCallback(
    (payload: GetUserMouseUpdatePayload) => {},
    []
  );

  useEffect(() => {
    socket.on("connection-success", connectionSuccess);
    socket.on("get-room-users", getRoomUsers);
    socket.on("user-joined", userJoined);
    socket.on("user-left", userLeft);
    socket.on("get-user-mouse-update", getUserMouseUpdate);

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
    [socket]
  );
  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
};
