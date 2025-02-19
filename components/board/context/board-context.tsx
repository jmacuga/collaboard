"use client";

import React, { createContext, useState, useMemo, useRef } from "react";
import Konva from "konva";
import { v4 as uuidv4 } from "uuid";

type Props = {
  children: React.ReactNode;
};

export type UserCursor = {
  x: number;
  y: number;
};
export type ModeType = "drawing" | "erasing" | "selecting" | "shapes";

export type ShapeType = "rectangle" | "circle" | "arrow";

interface BoardContextType {
  brushColor: string;
  setBrushColor: (color: string) => void;
  currentLineId: string;
  setCurrentLineId: (id: string) => void;
  mode: ModeType;
  setMode: (mode: ModeType) => void;
  selectedShapeIds: string[];
  setSelectedShapeIds: (ids: string[] | ((prev: string[]) => string[])) => void;
  isShapeSelected: (id: string) => boolean;
  brushSize: number;
  setBrushSize: (size: number) => void;
  shapeType: ShapeType;
  setShapeType: (type: ShapeType) => void;
  shapeColor: string;
  setShapeColor: (color: string) => void;
}

export const BoardContext = createContext<BoardContextType>(
  {} as BoardContextType
);

export const BoardContextProvider: React.FC<Props> = ({ children }) => {
  const [stageRef, setStageRef] =
    useState<React.RefObject<Konva.Stage | null> | null>(null);
  const [brushColor, setBrushColor] = useState<string>("rgb(0,0,0)");
  const [currentLineId, setCurrentLineId] = useState<string>(uuidv4());
  const [mode, setMode] = useState<ModeType>("selecting");
  const [selectedShapeIds, setSelectedShapeIds] = useState<string[]>([]);
  const [brushSize, setBrushSize] = useState<number>(2);
  const [shapeType, setShapeType] = useState<ShapeType>("rectangle");
  const [shapeColor, setShapeColor] = useState("rgb(0,0,0)");
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
      selectedShapeIds,
      setSelectedShapeIds,
      isShapeSelected,
      brushSize,
      setBrushSize,
      shapeType,
      setShapeType,
      shapeColor,
      setShapeColor,
    }),
    [
      stageRef,
      brushColor,
      currentLineId,
      mode,
      selectedShapeIds,
      brushSize,
      shapeType,
      shapeColor,
    ]
  );

  return (
    <BoardContext.Provider value={value}>{children}</BoardContext.Provider>
  );
};
