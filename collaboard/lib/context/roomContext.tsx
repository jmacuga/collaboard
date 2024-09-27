"use client";

import React, { createContext, useState, useMemo } from "react";
import Konva from "konva";

export const fills = [
  "#6B7280",
  "#EF4444",
  "#F59E0B",
  "#10B981",
  "#3B82F6",
  "#6366F1",
  "#8B5CF6",
  "#EC4899",
];

export const CANVAS_WIDTH = window.innerWidth;
export const CANVAS_HEIGHT = window.innerHeight;

export type ShapeType = "rect" | "ellipse" | "polygon";

type Props = {
  children: React.ReactNode;
};

export type Child = {
  id: string;
  color: string;
};

export type Node = {
  id: string;
  children: Child[];
  parents: string[];
  text: string;
  shapeType: ShapeType;
  x: number;
  y: number;
  width: number;
  height: number;
  fillStyle: string;
  strokeStyle: string;
};

export type UserCursor = {
  x: number;
  y: number;
};

export type RoomUser = {
  id: string;
  name: string | null;
  photoURL: string | null;
  color: string;
};

type IRoomContext = {
  nodes: Map<string, Node>;
  setNodes: React.Dispatch<React.SetStateAction<Map<string, Node>>>;
  selectedNode: Node | null;
  setSelectedNode: React.Dispatch<React.SetStateAction<Node | null>>;
};
export const RoomContext: React.Context<IRoomContext> = createContext(
  {} as IRoomContext
);

export const RoomContextProvider: React.FC<Props> = ({ children }) => {
  const [stageRef, setStageRef] = useState<React.RefObject<Konva.Stage> | null>(
    null
  );
  const [nodes, setNodes] = useState<Map<string, Node>>(new Map());
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);

  const [roomName, setRoomName] = useState<string>("");

  const value = useMemo(
    () => ({
      stageRef,
      setStageRef,
      nodes,
      setNodes,
      selectedNode,
      setSelectedNode,
      roomName,
      setRoomName,
    }),
    [nodes, selectedNode, stageRef, roomName]
  );

  return <RoomContext.Provider value={value}>{children}</RoomContext.Provider>;
};
