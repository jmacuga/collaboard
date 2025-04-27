import { useCallback, useContext, useRef } from "react";
import { KonvaEventObject } from "konva/lib/Node";
import { Vector2d } from "konva/lib/types";
import { BoardContext } from "../context/board-context";

export const useBoardPanning = () => {
  const { mode, setStagePosition, isPanning, maxWidth, maxHeight } =
    useContext(BoardContext);
  const lastPosition = useRef<Vector2d | null>(null);

  const handleBoardPanStart = useCallback((e: KonvaEventObject<MouseEvent>) => {
    isPanning.current = true;
    const stage = e.target.getStage();
    if (!stage) return;
    const pointerPosition = stage.getPointerPosition();
    if (!pointerPosition) return;
    lastPosition.current = pointerPosition;
  }, []);

  const handleBoardPanMove = useCallback(
    (e: KonvaEventObject<MouseEvent>) => {
      const stage = e.target.getStage();
      if (!stage || !isPanning.current || !lastPosition.current) return;
      const pointerPosition = stage.getPointerPosition();
      if (!pointerPosition) return;

      const dx = pointerPosition.x - lastPosition.current.x;
      const dy = pointerPosition.y - lastPosition.current.y;

      setStagePosition((prev) => {
        const newX = Math.min(
          0,
          Math.max(-maxWidth + stage.width(), prev.x + dx)
        );
        const newY = Math.min(
          0,
          Math.max(-maxHeight + stage.height(), prev.y + dy)
        );
        return { x: newX, y: newY };
      });

      lastPosition.current = pointerPosition;
    },
    [setStagePosition, maxWidth, maxHeight]
  );

  const handleBoardPanEnd = useCallback((e: KonvaEventObject<MouseEvent>) => {
    isPanning.current = false;
    lastPosition.current = null;

    const container = e.target.getStage()?.container();
    if (!container) return;
  }, []);

  return {
    handleBoardPanStart,
    handleBoardPanMove,
    handleBoardPanEnd,
  };
};
