"use client";

import { useContext } from "react";
import { BoardContext } from "@/context/boardContext";

function useDrawLine() {
  const { lines, setLines, currentLineId } = useContext(BoardContext);

  const drawLine = (e) => {
    const lastLine = lines.get(currentLineId);
    const stage = e.target.getStage();
    const point = stage.getPointerPosition();
    if (!lastLine) {
      return;
    }

    lastLine.points = lastLine.points.concat([point.x, point.y]);
    lines.set(currentLineId, lastLine);
    setLines(new Map(lines)); // workaround for rerender
    return lastLine;
  };

  return [drawLine];
}

function useStartLine({
  tool,
  brushColor,
}: {
  tool: string;
  brushColor: string;
}) {
  const { lines, setLines, currentLineId } = useContext(BoardContext);

  const startLine = (e) => {
    const pos = e.target.getStage().getPointerPosition();
    const newLine = {
      id: currentLineId,
      points: [pos.x, pos.y],
      stroke: brushColor,
      strokeWidth: 5,
      globalCompositeOperation: tool,
    };
    const newLines = new Map(lines);
    newLines.set(currentLineId, newLine);
    setLines(newLines);
  };

  return [startLine];
}

export { useDrawLine, useStartLine };
