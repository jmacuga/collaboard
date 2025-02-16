"use client";
import SideToolbar from "@/components/board/side-toolbar";
import { useEffect, useContext, useState, useRef, useCallback } from "react";
import { Stage, Layer, Line, Shape, Rect } from "react-konva";
import { BoardContext } from "@/components/board/context/board-context";
import { useDrawing } from "@/components/board/hooks/use-drawing";
import { v4 as uuidv4 } from "uuid";
import { KonvaNodeSchema } from "@/types/KonvaNodeSchema";
import Konva from "konva";
import { LineConfig } from "konva/lib/shapes/Line";
import { useClientDoc } from "@/components/board/context/client-doc-context";
import { useDocument } from "@automerge/automerge-repo-react-hooks";
import { AnyDocumentId } from "@automerge/automerge-repo";

export default function Board({}: {}) {
  const clientDocService = useClientDoc();
  const [localDoc, setLocalDoc] = useDocument<KonvaNodeSchema>(
    clientDocService.getDocUrl() as AnyDocumentId
  );
  const { brushColor, setBrushColor, currentLineId, setCurrentLineId } =
    useContext(BoardContext);
  const [mode, setMode] = useState("selecting");
  const modeStateRef = useRef(mode);
  const [tool, setTool] = useState("pen");
  const isDrawing = useRef(false);

  const [startLine, drawLine, endLine, localPoints, createLine] = useDrawing();

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
    if (!isDrawing.current || mode !== "drawing") return;
    drawLine(e);
    const pos = e.target.getStage()?.getPointerPosition();
    if (!pos) return;

    setLocalLine(createLine(currentLineId, localPoints, brushColor));
  };

  const handleMouseUp = useCallback(() => {
    if (mode === "drawing") {
      isDrawing.current = false;
      endLine();
      setCurrentLineId(uuidv4());
      setLocalLine(null);
    }
  }, [mode, endLine, setCurrentLineId]);

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
          width={window.innerWidth}
          height={window.innerHeight}
          onMouseDown={handleMouseDown}
          onTouchStart={handleMouseDown}
          onMouseMove={handleMouseMove}
          onTouchMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onTouchEnd={handleMouseUp}
        >
          <Layer>
            {localDoc?.children?.map((shape: KonvaNodeSchema) => {
              if (shape.className == "Line") {
                return (
                  <Line key={shape.attrs.id ?? "0"} {...shape.attrs}></Line>
                );
              }
            })}
            {localLine && <Line key={currentLineId} {...localLine} />}
          </Layer>
        </Stage>
      </div>
    </div>
  );
}
