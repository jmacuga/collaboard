import { useCallback, useRef, useState } from "react";
import { KonvaEventObject } from "konva/lib/Node";
import { Vector2d } from "konva/lib/types";

export const useBoardPanning = () => {
  const [stagePosition, setStagePosition] = useState<Vector2d>({ x: 0, y: 0 });
  const isPanning = useRef(false);
  const lastPosition = useRef<Vector2d | null>(null);

  const handleBoardPanStart = useCallback(
    (e: KonvaEventObject<MouseEvent | TouchEvent>) => {
      const stage = e.target.getStage();
      if (!stage) return;

      isPanning.current = true;
      const pointerPosition = stage.getPointerPosition();
      if (pointerPosition) {
        lastPosition.current = pointerPosition;
      }

      const container = stage.container();
      container.style.cursor = "grabbing";
    },
    []
  );

  const handleBoardPanMove = useCallback(
    (e: KonvaEventObject<MouseEvent | TouchEvent>) => {
      const stage = e.target.getStage();
      if (!stage || !isPanning.current || !lastPosition.current) return;

      const pointerPosition = stage.getPointerPosition();
      if (!pointerPosition) return;

      // Calculate how much the pointer has moved
      const dx = pointerPosition.x - lastPosition.current.x;
      const dy = pointerPosition.y - lastPosition.current.y;

      // Update the stage position
      setStagePosition((prev) => ({
        x: prev.x + dx,
        y: prev.y + dy,
      }));

      // Update the last position
      lastPosition.current = pointerPosition;
    },
    []
  );

  const handleBoardPanEnd = useCallback(
    (e: KonvaEventObject<MouseEvent | TouchEvent>) => {
      const stage = e.target.getStage();
      if (!stage) return;

      isPanning.current = false;
      lastPosition.current = null;

      const container = stage.container();
      container.style.cursor = "grab";
    },
    []
  );

  const resetPosition = useCallback(() => {
    setStagePosition({ x: 0, y: 0 });
  }, []);

  return {
    stagePosition,
    setStagePosition,
    handleBoardPanStart,
    handleBoardPanMove,
    handleBoardPanEnd,
    resetPosition,
  };
};
