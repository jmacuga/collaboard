"use client";
import Konva from "konva";

const { useState, useEffect } = require("react");

function useCreateLine({
  e,
  lines,
  setLines,
}: {
  e: any;
  lines: [Konva.Line];
  setLines: any;
}) {
  const stage = e.target.getStage();
  const point = stage.getPointerPosition();
  let lastLine = lines[lines.length - 1];
  lastLine.points = lastLine.points.concat([point.x, point.y]);
  lines.splice(lines.length - 1, 1, lastLine);
  setLines(lines.concat());

  return lastLine;
}

function useStartLine({
  e,
  lines,
  setLines,
  tool,
}: {
  e: any;
  lines: [Konva.Line];
  setLines: any;
  tool: string;
}) {
  const pos = e.target.getStage().getPointerPosition();
  setLines([...lines, { tool, points: [pos.x, pos.y] }]);
}

export { useCreateLine, useStartLine };
