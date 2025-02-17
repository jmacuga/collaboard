"use client";
import SideToolbar from "@/components/board/side-toolbar";
import { useEffect, useContext, useState, useRef, useCallback } from "react";
import { Stage, Layer, Line, Shape, Rect, Transformer } from "react-konva";
import {
  BoardContext,
  ModeType,
} from "@/components/board/context/board-context";
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
import { useErasing } from "@/components/board/hooks/use-erasing";

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
    selectedShapeIds,
    setSelectedShapeIds,
    brushSize,
    setBrushSize,
  } = useContext(BoardContext);

  const isDrawing = useRef(false);
  const [startLine, drawLine, endLine, localPoints, createLine] = useDrawing();
  const { draggingState, handleDragStart, handleDragEnd } = useDragging();
  const { transformerRef, handleTransformEnd } = useTransformer(localDoc);
  const { handleEraseStart, handleEraseMove, handleEraseEnd } = useErasing();

  function setCursorMode(new_mode: ModeType) {
    setMode(new_mode);
  }

  const handleMouseDown = (
    e: Konva.KonvaEventObject<MouseEvent | TouchEvent>
  ) => {
    if (mode === "drawing") {
      isDrawing.current = true;
      startLine(e);
    } else if (mode === "erasing") {
      handleEraseStart(e);
    }
  };

  const [localLine, setLocalLine] = useState<LineConfig | null>(null);

  const handleMouseMove = (
    e: Konva.KonvaEventObject<MouseEvent | TouchEvent>
  ) => {
    if (mode === "drawing") {
      if (!isDrawing.current) return;
      drawLine(e);
      const pos = e.target.getStage()?.getPointerPosition();
      if (!pos) return;
      setLocalLine(
        createLine(currentLineId, localPoints, brushColor, brushSize)
      );
    } else if (mode === "erasing") {
      handleEraseMove(e);
    }
  };

  const handleMouseUp = useCallback(() => {
    if (mode === "drawing") {
      isDrawing.current = false;
      endLine();
      setCurrentLineId(uuidv4());
      setLocalLine(null);
    } else if (mode === "erasing") {
      handleEraseEnd();
    }
  }, [endLine, setCurrentLineId]);

  const handleStageClick = (e: Konva.KonvaEventObject<MouseEvent>) => {
    if (e.target === e.target.getStage()) {
      setSelectedShapeIds([]);
    }
  };

  const handleShapeClick = (e: Konva.KonvaEventObject<MouseEvent>) => {
    if (mode !== "selecting") return;

    e.cancelBubble = true;
    const shapeId = e.target.attrs.id;
    setSelectedShapeIds([shapeId]);
  };

  return (
    <div className="flex h-screen flex-col md:flex-row md:overflow-hidden ">
      <div className="z-10 flex-shrink ">
        <SideToolbar />
      </div>
      <div className={`${mode === "erasing" ? "cursor-crosshair" : ""}`}>
        <Stage
          width={window.innerWidth}
          height={window.innerHeight}
          onMouseDown={handleMouseDown}
          onTouchStart={handleMouseDown}
          onMouseMove={handleMouseMove}
          onTouchMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onTouchEnd={handleMouseUp}
          onClick={handleStageClick}
        >
          <Layer>
            {localDoc?.children?.map((shape: KonvaNodeSchema) => {
              if (shape.className == "Line") {
                return (
                  <Line
                    key={shape.attrs.id ?? "0"}
                    {...shape.attrs}
                    draggable={mode === "selecting"}
                    onClick={handleShapeClick}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                    onTransformEnd={handleTransformEnd}
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
