"use client";
import { Line } from "@/lib/context/roomContext";
function useCreateLine({
  e,
  lines,
  setLines,
  currentLineId,
}: {
  e: any;
  lines: Map<string, Line>;
  setLines: any;
  currentLineId: string;
}) {
  const stage = e.target.getStage();
  const point = stage.getPointerPosition();
  const lastLine = lines.get(currentLineId);
  if (!lastLine) {
    return;
  }
  lastLine.points = lastLine.points.concat([point.x, point.y]);
  lines.set(currentLineId, lastLine);
  setLines(new Map(lines)); // workaround for rerender
  return lastLine;
}

function useStartLine({
  e,
  lines,
  setLines,
  tool,
  brushColor,
  currentLineId,
}: {
  e: any;
  lines: Map<string, Line>;
  setLines: any;
  tool: string;
  brushColor: string;
  currentLineId: string;
}) {
  const pos = e.target.getStage().getPointerPosition();
  const newLine = {
    id: currentLineId,
    points: [pos.x, pos.y],
    stroke: brushColor,
    strokeWidth: 5,
    globalCompositeOperation: tool,
  };
  setLines(lines.set(currentLineId, newLine));
}

export { useCreateLine, useStartLine };
