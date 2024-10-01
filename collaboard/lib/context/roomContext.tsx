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

export type Line = {
  id: string;
  points: number[];
  stroke: string;
  strokeWidth: number;
  globalCompositeOperation: string;
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
  shapes: Map<string, Konva.Shape>;
  setShapes: React.Dispatch<React.SetStateAction<Map<string, Konva.Shape>>>;
  brushColor: string;
  setBrushColor: React.Dispatch<React.SetStateAction<string>>;
  lines: Map<string, Line>;
  setLines: React.Dispatch<React.SetStateAction<Map<string, Line>>>;
};
export const RoomContext: React.Context<IRoomContext> = createContext(
  {} as IRoomContext
);

export const RoomContextProvider: React.FC<Props> = ({ children }) => {
  const [stageRef, setStageRef] = useState<React.RefObject<Konva.Stage> | null>(
    null
  );
  const [lines, setLines] = useState<Map<string, Line>>(new Map());
  const [brushColor, setBrushColor] = useState<string>("rgb(0,0,0)");
  const [roomName, setRoomName] = useState<string>("");

  const value = useMemo(
    () => ({
      stageRef,
      setStageRef,
      roomName,
      setRoomName,
      brushColor,
      setBrushColor,
      lines,
      setLines,
    }),
    [stageRef, roomName, lines, brushColor]
  );

  return <RoomContext.Provider value={value}>{children}</RoomContext.Provider>;
};
