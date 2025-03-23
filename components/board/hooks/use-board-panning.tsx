import { useCallback, useContext, useRef } from "react";
import { KonvaEventObject } from "konva/lib/Node";
import { Vector2d } from "konva/lib/types";
import { BoardContext } from "../context/board-context";

export const useBoardPanning = () => {
  const { mode, setStagePosition } = useContext(BoardContext);
  const isPanning = useRef(false);
  const lastPosition = useRef<Vector2d | null>(null);

  const handleBoardPanStart = useCallback((e: KonvaEventObject<MouseEvent>) => {
    const stage = e.target.getStage();
    if (!stage) return;

    isPanning.current = true;
    const pointerPosition = stage.getPointerPosition();
    if (!pointerPosition) return;

    lastPosition.current = pointerPosition;
    const container = stage.container();
    container.style.cursor = "grabbing";
  }, []);

  const handleBoardPanMove = useCallback(
    (e: KonvaEventObject<MouseEvent>) => {
      const stage = e.target.getStage();
      if (!stage || !isPanning.current || !lastPosition.current) return;

      const pointerPosition = stage.getPointerPosition();
      if (!pointerPosition) return;

      const dx = pointerPosition.x - lastPosition.current.x;
      const dy = pointerPosition.y - lastPosition.current.y;

      setStagePosition((prev) => ({
        x: prev.x + dx,
        y: prev.y + dy,
      }));

      lastPosition.current = pointerPosition;
    },
    [setStagePosition]
  );

  const handleBoardPanEnd = useCallback(
    (e: KonvaEventObject<MouseEvent>) => {
      isPanning.current = false;
      lastPosition.current = null;

      const container = e.target.getStage()?.container();
      if (!container) return;

      if (mode === "panning") {
        container.style.cursor = "grab";
      } else if (mode === "erasing") {
        container.style.cursor = "crosshair";
      } else {
        container.style.cursor = "default";
      }
    },
    [mode]
  );

  return {
    handleBoardPanStart,
    handleBoardPanMove,
    handleBoardPanEnd,
  };
};
