import React, {
  createContext,
  useState,
  useMemo,
  useRef,
  useEffect,
  useCallback,
} from "react";
import Konva from "konva";
import { v4 as uuidv4 } from "uuid";
import { KonvaEventObject } from "konva/lib/Node";
import { Vector2d } from "konva/lib/types";
import { BoardMode } from "@/types/board";
type Props = {
  children: React.ReactNode;
  syncedInitial: boolean;
};

export type UserCursor = {
  x: number;
  y: number;
};

export type ShapeType = "rectangle" | "circle" | "arrow";
export type Point = Vector2d;

interface BoardContextType {
  brushColor: string;
  setBrushColor: (color: string) => void;
  textColor: string;
  setTextColor: (color: string) => void;
  currentLineId: string;
  setCurrentLineId: (id: string) => void;
  mode: BoardMode;
  setBoardMode: (mode: BoardMode) => void;
  selectedShapeIds: string[];
  setSelectedShapeIds: (ids: string[] | ((prev: string[]) => string[])) => void;
  isShapeSelected: (id: string) => boolean;
  brushSize: number;
  setBrushSize: (size: number) => void;
  textFontSize: number;
  setTextFontSize: (size: number) => void;
  shapeType: ShapeType;
  setShapeType: (type: ShapeType) => void;
  shapeColor: string;
  setShapeColor: (color: string) => void;
  isOnline: boolean;
  setIsOnline: (online: boolean) => void;
  getPointerPosition: (e: KonvaEventObject<MouseEvent>) => Point | null;
  localPoints: number[];
  setLocalPoints: (points: number[] | ((prev: number[]) => number[])) => void;
  stagePosition: Vector2d;
  setStagePosition: (
    position: Vector2d | ((prev: Vector2d) => Vector2d)
  ) => void;
  resetStagePosition: () => void;
  editingText: string | null;
  setEditingText: (text: string | null) => void;
  textPosition: Point | null;
  setTextPosition: (position: Point | null) => void;
  currentTextId: string | null;
  setCurrentTextId: (id: string | null) => void;
  textareaRef: React.RefObject<HTMLTextAreaElement>;
  isPanning: React.MutableRefObject<boolean>;
  synced: boolean;
  setSynced: (synced: boolean) => void;
}

export const BoardContext = createContext<BoardContextType>(
  {} as BoardContextType
);

export const BoardContextProvider: React.FC<Props> = ({
  children,
  syncedInitial,
}) => {
  const [stageRef, setStageRef] =
    useState<React.RefObject<Konva.Stage | null> | null>(null);
  const [brushColor, setBrushColor] = useState<string>("rgb(0,0,0)");
  const [currentLineId, setCurrentLineId] = useState<string>(uuidv4());
  const [mode, setMode] = useState<BoardMode>("selecting");
  const [selectedShapeIds, setSelectedShapeIds] = useState<string[]>([]);
  const [brushSize, setBrushSize] = useState<number>(2);
  const [shapeType, setShapeType] = useState<ShapeType>("rectangle");
  const [shapeColor, setShapeColor] = useState("rgb(0,0,0)");
  const [textColor, setTextColor] = useState("rgb(0,0,0)");
  const [textFontSize, setTextFontSize] = useState<number>(24);
  const [isOnline, setIsOnline] = useState<boolean>(syncedInitial);
  const [localPoints, setLocalPoints] = useState<number[]>([]);
  const [stagePosition, setStagePosition] = useState<Vector2d>({ x: 0, y: 0 });
  const [editingText, setEditingText] = useState<string | null>(null);
  const [textPosition, setTextPosition] = useState<Point | null>(null);
  const [currentTextId, setCurrentTextId] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const isPanning = useRef<boolean>(false);
  const [synced, setSynced] = useState<boolean>(syncedInitial);

  const getCursorForMode = (mode: BoardMode): string => {
    switch (mode) {
      case "panning":
        if (isPanning.current) {
          return "grabbing";
        }
        return "grab";
      case "erasing":
        return "crosshair";
      case "text":
        return "text";
      case "selecting":
      case "drawing":
      case "shapes":
        return "default";
      default:
        return "default";
    }
  };

  const setBoardMode = useCallback((mode: BoardMode) => {
    setMode(mode);
    const container = document.querySelector(".konvajs-content") as HTMLElement;
    if (container) {
      container.style.cursor = getCursorForMode(mode);
    }
    if (mode !== "text") {
      setEditingText(null);
      setTextPosition(null);
      setCurrentTextId(null);
    }
  }, []);

  const resetStagePosition = useCallback(() => {
    setStagePosition({ x: 0, y: 0 });
  }, []);

  const isShapeSelected = (id: string): boolean => {
    return selectedShapeIds.includes(id);
  };

  const getPointerPosition = (
    e: KonvaEventObject<MouseEvent>
  ): Point | null => {
    const stage = e.target.getStage();
    const point = stage?.getPointerPosition() ?? null;
    const stagePosition = stage?.getPosition() ?? null;
    if (point !== null && stagePosition !== null) {
      point.x = point.x - stagePosition.x;
      point.y = point.y - stagePosition.y;
    }
    return point;
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
      setBoardMode,
      selectedShapeIds,
      setSelectedShapeIds,
      isShapeSelected,
      brushSize,
      setBrushSize,
      shapeType,
      setShapeType,
      shapeColor,
      setShapeColor,
      isOnline,
      setIsOnline,
      textColor,
      setTextColor,
      textFontSize,
      setTextFontSize,
      getPointerPosition,
      localPoints,
      setLocalPoints,
      stagePosition,
      setStagePosition,
      resetStagePosition,
      editingText,
      setEditingText,
      textPosition,
      setTextPosition,
      currentTextId,
      setCurrentTextId,
      textareaRef,
      isPanning,
      synced,
      setSynced,
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
      isOnline,
      textColor,
      setTextColor,
      textFontSize,
      setTextFontSize,
      getPointerPosition,
      localPoints,
      setLocalPoints,
      stagePosition,
      resetStagePosition,
      editingText,
      textPosition,
      currentTextId,
      setBoardMode,
      synced,
      setSynced,
    ]
  );

  return (
    <BoardContext.Provider value={value}>{children}</BoardContext.Provider>
  );
};
