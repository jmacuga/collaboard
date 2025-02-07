"use client";
import SideToolbar from "@/components/canvas/side-toolbar";
import { useEffect, useContext, useState, useRef, useCallback } from "react";
import { Stage, Layer, Line, Shape, Rect } from "react-konva";
import * as A from "@automerge/automerge-repo";
import { BoardContext } from "@/context/boardContext";
import { useDrawing } from "@/components/canvas/hooks/useDrawing";
import { v4 as uuidv4 } from "uuid";
import { useDocument } from "@automerge/automerge-repo-react-hooks";
import { uuid } from "@automerge/automerge";
import KonvaNodeSchema from "@/types/KonvaNodeSchema";
import Konva from "konva";
import { LineConfig } from "konva/lib/shapes/Line";

export default function Board({ docUrl }: { docUrl: A.AutomergeUrl }) {
  const [doc, changeDoc] = useDocument<KonvaNodeSchema>(docUrl);
  const {
    lines,
    setLines,
    brushColor,
    setBrushColor,
    currentLineId,
    setCurrentLineId,
  } = useContext(BoardContext);

  const [mode, setMode] = useState("selecting");
  const modeStateRef = useRef(mode);
  const [tool, setTool] = useState("pen");
  const isDrawing = useRef(false);

  const [startLine, drawLine, localPoints] = useDrawing({ docUrl: docUrl });

  useEffect(() => {
    console.log(mode);
    modeStateRef.current = mode;
  }, [mode]);

  function setCursorMode(new_mode: string) {
    setMode(new_mode);
  }
  const handleMouseDown = (
    e: Konva.KonvaEventObject<MouseEvent | TouchEvent>
  ) => {
    if (mode == "drawing") {
      isDrawing.current = true;
      startLine(e);
    }
  };

  const [localLine, setLocalLine] = useState<LineConfig | null>(null);

  const handleMouseMove = (
    e: Konva.KonvaEventObject<MouseEvent | TouchEvent>
  ) => {
    if (mode === "drawing") {
      if (!isDrawing.current) {
        return;
      }
      drawLine(e);

      setLocalLine({
        points: localPoints,
        stroke: brushColor,
        strokeWidth: 2,
        tension: 0.5,
        lineCap: "round",
        lineJoin: "round",
      });
    }
  };

  const handleMouseUp = useCallback(() => {
    if (mode === "drawing") {
      isDrawing.current = false;
      setCurrentLineId(uuidv4());
      setLocalLine(null);
    }
  }, [mode, lines, currentLineId]);

  return (
    <div className="flex h-screen flex-col md:flex-row md:overflow-hidden ">
      <div className="z-10 flex-shrink ">
        <SideToolbar
          setCursorMode={setCursorMode}
          changeBrushColor={setBrushColor}
          cursorMode={mode}
        />
      </div>
      <div className="flex-grow md:overflow-y-auto">
        <Stage
          key={uuid()}
          width={window.innerWidth}
          height={window.innerHeight}
          onMouseDown={handleMouseDown}
          onTouchStart={handleMouseDown}
          onMouseMove={handleMouseMove}
          onTouchMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onTouchEnd={handleMouseUp}
        >
          <Layer key={uuid()}>
            {doc?.children?.map((shape) => {
              if (shape.className == "Line") {
                return <Line key={uuid()} {...shape.attrs}></Line>;
              }
            })}
            {localLine && <Line {...localLine} />}
          </Layer>
        </Stage>
      </div>
    </div>
  );
}
