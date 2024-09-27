"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
} from "react";
import { io, Socket } from "socket.io-client";
import { Node, RoomContext, RoomUser, UserCursor } from "./roomContext";

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
  const { setNodes } = useContext(RoomContext);

  const connectionSuccess = () => {
    console.log("connection successful!");
  };

  const getRoomUsers = useCallback((payload: UserJoinedPayload[]) => {}, []);
  const userJoined = useCallback((payload: UserJoinedPayload) => {}, []);
  const userLeft = useCallback(({ socketId }: { socketId: string }) => {}, []);

  const getRoomUpdate = useCallback(
    (payload: UpdateRoomPayload) => {
      const { data } = payload;
      if (payload.type === "update") {
        if (data) {
          data.forEach((node) => {
            setNodes((prevState) => {
              prevState.set(node.id, node);
              return new Map(prevState);
            });
          });
        }
      }
      if (payload.type === "history") {
        if (data) {
          const updatedNodes: Map<string, Node> = new Map();
          data.forEach((node) => {
            updatedNodes.set(node.id, node);
          });
          setNodes(updatedNodes);
        }
      }
    },
    [setNodes]
  );

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
  }, [getRoomUpdate, userJoined, userLeft, getUserMouseUpdate, getRoomUsers]);

  const socketMemo = useMemo(
    () => ({
      socket,
    }),
    []
  );

  return (
    <SocketContext.Provider value={socketMemo}>
      {children}
    </SocketContext.Provider>
  );
};
