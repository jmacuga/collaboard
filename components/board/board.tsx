"use client";
import SideToolbar from "@/components/board/side-toolbar";
import { useEffect, useContext, useState, useRef, useCallback } from "react";
import { Stage, Layer, Line, Shape, Rect, Transformer } from "react-konva";
import { BoardContext } from "@/components/board/context/board-context";
import { useDrawing } from "@/components/board/hooks/use-drawing";
import { v4 as uuidv4 } from "uuid";
import { KonvaNodeSchema } from "@/types/KonvaNodeSchema";
import Konva from "konva";
import { LineConfig } from "konva/lib/shapes/Line";
import { useClientSync } from "@/components/board/context/client-doc-context";
import { useDocument } from "@automerge/automerge-repo-react-hooks";
import { AnyDocumentId } from "@automerge/automerge-repo";
import { useDragging } from "@/components/board/hooks/use-dragging";
import { useTransformer } from "@/components/board/hooks/use-transformer";

export default function Board({}: {}) {
  const clientSyncService = useClientSync();
  const [localDoc, setLocalDoc] = useDocument<KonvaNodeSchema>(
    clientSyncService.getDocUrl() as AnyDocumentId
  );
  const {
    brushColor,
    setBrushColor,
    currentLineId,
    setCurrentLineId,
    mode,
    setMode,
    tool,
    setTool,
    selectedShapeIds,
    setSelectedShapeIds,
  } = useContext(BoardContext);

  const isDrawing = useRef(false);
  const modeStateRef = useRef(mode);
  const [startLine, drawLine, endLine, localPoints, createLine] = useDrawing();
  const { draggingState, handleDragStart, handleDragEnd } = useDragging();
  const { transformerRef } = useTransformer(localDoc);

  useEffect(() => {
    modeStateRef.current = mode;
  }, [mode]);

  function setCursorMode(new_mode: string) {
    setMode(new_mode);
  }

  const handleMouseDown = (
    e: Konva.KonvaEventObject<MouseEvent | TouchEvent>
  ) => {
    if (mode === "drawing") {
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

  const handleShapeClick = (e: Konva.KonvaEventObject<MouseEvent>) => {
    const shapeId = e.target.attrs.id;
    setSelectedShapeIds((prev: string[]): string[] => {
      return prev.includes(shapeId)
        ? prev.filter((id: string) => id !== shapeId)
        : [...prev, shapeId];
    });
  };

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
                  <Line
                    key={shape.attrs.id ?? "0"}
                    {...shape.attrs}
                    draggable
                    onClick={handleShapeClick}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                    ref={(node) => {
                      shape.attrs.ref = node;
                    }}
                  />
                );
              }
            })}
            {localLine && <Line key={currentLineId} {...localLine} />}
            <Transformer ref={transformerRef} />
          </Layer>
        </Stage>
      </div>
    </div>
  );
}
