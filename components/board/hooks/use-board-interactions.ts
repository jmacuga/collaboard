import { useCallback, useContext, useRef } from "react";
import { KonvaEventObject } from "konva/lib/Node";
import { BoardMode } from "@/types/board";
import { useDrawing } from "./use-drawing";
import { useDragging } from "./use-dragging";
import { useErasing } from "./use-erasing";
import { useShape } from "./use-shape";
import { useBoardPanning } from "./use-board-panning";
import { useText } from "./use-text";
import { v4 as uuidv4 } from "uuid";
import { BoardContext } from "../context/board-context";

export const useBoardInteractions = () => {
  const isDrawing = useRef(false);
  const { mode, setBoardMode, setSelectedShapeIds, setCurrentLineId } =
    useContext(BoardContext);
  const { startLine, drawLine, endLine } = useDrawing();
  const { handleDragStart, handleDragEnd } = useDragging();
  const { handleEraseStart, handleEraseMove, handleEraseEnd } = useErasing();
  const { addShape } = useShape();
  const { handleBoardPanStart, handleBoardPanMove, handleBoardPanEnd } =
    useBoardPanning();
  const { addText, handleTextBlur } = useText();

  const handleMouseDown = useCallback(
    (e: KonvaEventObject<MouseEvent>) => {
      if (mode === "drawing") {
        isDrawing.current = true;
        startLine(e);
      } else if (mode === "erasing") {
        handleEraseStart(e);
      } else if (mode === "shapes") {
        addShape(e);
        setBoardMode("selecting");
      } else if (mode === "panning") {
        handleBoardPanStart(e);
      } else if (mode === "text") {
        addText(e);
      } else if (mode === "selecting") {
        handleTextBlur();
      }
    },
    [
      mode,
      startLine,
      handleEraseStart,
      addShape,
      setBoardMode,
      handleBoardPanStart,
      addText,
    ]
  );

  const handleMouseMove = useCallback(
    (e: KonvaEventObject<MouseEvent>) => {
      if (mode === "drawing") {
        if (!isDrawing.current) return;
        drawLine(e as KonvaEventObject<MouseEvent>);
      } else if (mode === "erasing") {
        handleEraseMove(e as KonvaEventObject<MouseEvent>);
      } else if (mode === "panning") {
        handleBoardPanMove(e);
      }
    },
    [mode, drawLine, handleEraseMove, handleBoardPanMove]
  );

  const handleMouseUp = useCallback(
    (e: KonvaEventObject<MouseEvent>) => {
      if (mode === "drawing") {
        isDrawing.current = false;
        endLine();
        setCurrentLineId(uuidv4());
      } else if (mode === "erasing") {
        handleEraseEnd();
      } else if (mode === "panning") {
        handleBoardPanEnd(e);
      }
    },
    [mode, endLine, setCurrentLineId, handleEraseEnd, handleBoardPanEnd]
  );

  const handleStageClick = useCallback(
    (e: KonvaEventObject<MouseEvent>) => {
      if (e.target === e.target.getStage()) {
        setSelectedShapeIds([]);
      }
    },
    [setSelectedShapeIds]
  );

  const handleShapeMouseDown = useCallback(
    (e: KonvaEventObject<MouseEvent>) => {
      if (mode !== "selecting") return;
      e.cancelBubble = true;
      const shapeId = e.target.attrs.id;
      setSelectedShapeIds([shapeId]);
    },
    [mode, setSelectedShapeIds]
  );

  return {
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleStageClick,
    handleShapeMouseDown,
    handleDragStart,
    handleDragEnd,
  };
};
