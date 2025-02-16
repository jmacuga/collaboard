"use client";

import React, { createContext, useState, useMemo } from "react";
import Konva from "konva";
import { v4 as uuidv4 } from "uuid";
import { KonvaNodeSchema } from "@/types/KonvaNodeSchema";

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

type Props = {
  children: React.ReactNode;
};

export type UserCursor = {
  x: number;
  y: number;
};

interface BoardContextType {
  brushColor: string;
  setBrushColor: (color: string) => void;
  currentLineId: string;
  setCurrentLineId: (id: string) => void;
  mode: string;
  setMode: (mode: string) => void;
  tool: string;
  setTool: (tool: string) => void;
  selectedShapeIds: string[];
  setSelectedShapeIds: (ids: string[] | ((prev: string[]) => string[])) => void;
  isShapeSelected: (id: string) => boolean;
  brushSize: number;
  setBrushSize: (size: number) => void;
}

export const BoardContext = createContext<BoardContextType>(
  {} as BoardContextType
);

export const BoardContextProvider: React.FC<Props> = ({ children }) => {
  const [stageRef, setStageRef] =
    useState<React.RefObject<Konva.Stage | null> | null>(null);
  const [brushColor, setBrushColor] = useState<string>("rgb(0,0,0)");
  const [currentLineId, setCurrentLineId] = useState<string>(uuidv4());
  const [mode, setMode] = useState("selecting");
  const [tool, setTool] = useState("pen");
  const [selectedShapeIds, setSelectedShapeIds] = useState<string[]>([]);
  const [brushSize, setBrushSize] = useState<number>(2);
  const isShapeSelected = (id: string): boolean => {
    return selectedShapeIds.includes(id);
  };

  const value = useMemo(
    () => ({
      stageRef,
      setStageRef,
      brushColor,
      setBrushColor,
      currentLineId,
      setCurrentLineId,
      mode,
      setMode,
      tool,
      setTool,
      selectedShapeIds,
      setSelectedShapeIds,
      isShapeSelected,
      brushSize,
      setBrushSize,
    }),
    [
      stageRef,
      brushColor,
      currentLineId,
      mode,
      tool,
      selectedShapeIds,
      brushSize,
    ]
  );

  return (
    <BoardContext.Provider value={value}>{children}</BoardContext.Provider>
  );
};
