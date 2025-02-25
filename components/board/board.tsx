"use client";
import SideToolbar from "@/components/board/side-toolbar";
import { useEffect, useContext, useState, useRef, useCallback } from "react";
import {
  Stage,
  Layer,
  Line,
  Rect,
  Transformer,
  Circle,
  Arrow,
} from "react-konva";
import { BoardContext } from "@/components/board/context/board-context";
import { useDrawing } from "@/components/board/hooks/use-drawing";
import { v4 as uuidv4 } from "uuid";
import { KonvaNodeSchema, LayerSchema } from "@/types/KonvaNodeSchema";
import Konva from "konva";
import { LineConfig } from "konva/lib/shapes/Line";
import { useClientSync } from "@/components/board/context/client-doc-context";
import { useDocument, useHandle } from "@automerge/automerge-repo-react-hooks";
import { AnyDocumentId } from "@automerge/automerge-repo";
import { useDragging } from "@/components/board/hooks/use-dragging";
import { useTransformer } from "@/components/board/hooks/use-transformer";
import { useErasing } from "@/components/board/hooks/use-erasing";
import { useShape } from "@/components/board/hooks/use-shape";
import { OnlineToggle } from "./components/online-toggle";

export default function Board({}: {}) {
  const clientSyncService = useClientSync();
  const [localDoc] = useDocument<LayerSchema>(
    clientSyncService.getDocUrl() as AnyDocumentId
  );
  const {
    brushColor,
    brushSize,
    currentLineId,
    setCurrentLineId,
    mode,
    setMode,
    setSelectedShapeIds,
    isOnline,
  } = useContext(BoardContext);

  const isDrawing = useRef(false);
  const [startLine, drawLine, endLine, localPoints, createLine] = useDrawing();
  const { handleDragStart, handleDragEnd } = useDragging();
  const { transformerRef, handleTransformEnd } = useTransformer(localDoc);
  const { handleEraseStart, handleEraseMove, handleEraseEnd } = useErasing();
  const { addShape } = useShape();
  const handle = useHandle<LayerSchema>(
    clientSyncService.getDocUrl() as AnyDocumentId
  );
  useEffect(() => {
    console.log(`The board is now ${isOnline ? "online" : "offline"}.`);
  }, [isOnline]);

  useEffect(() => {
    if (!handle) return;
    handle.on("change", (change) => {
      console.log(change);
    });
  }, [handle]);

  const handleMouseDown = (
    e: Konva.KonvaEventObject<MouseEvent | TouchEvent>
  ) => {
    if (mode === "drawing") {
      isDrawing.current = true;
      startLine(e);
    } else if (mode === "erasing") {
      handleEraseStart(e);
    } else if (mode === "shapes") {
      addShape(e as Konva.KonvaEventObject<MouseEvent>);
      setMode("selecting");
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
    <div className="relative w-full h-full">
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
              {localDoc &&
                (Object.entries(localDoc) as [string, KonvaNodeSchema][]).map(
                  ([id, shape]) => {
                    if (shape.className == "Line") {
                      return (
                        <Line
                          key={id}
                          {...shape.attrs}
                          draggable={mode === "selecting"}
                          onClick={handleShapeClick}
                          onDragStart={handleDragStart}
                          onDragEnd={handleDragEnd}
                          onTransformEnd={handleTransformEnd}
                          strokeScaleEnabled={false}
                          ref={(node) => {
                            shape.attrs.ref = node;
                          }}
                        />
                      );
                    }
                    if (shape.className == "Rect") {
                      return (
                        <Rect
                          key={id}
                          {...shape.attrs}
                          draggable={mode === "selecting"}
                          onClick={handleShapeClick}
                          onDragStart={handleDragStart}
                          onDragEnd={handleDragEnd}
                          onTransformEnd={handleTransformEnd}
                          strokeScaleEnabled={false}
                          ref={(node) => {
                            shape.attrs.ref = node;
                          }}
                        />
                      );
                    }
                    if (shape.className == "Circle") {
                      return (
                        <Circle
                          key={id}
                          draggable={mode === "selecting"}
                          onClick={handleShapeClick}
                          onDragStart={handleDragStart}
                          onDragEnd={handleDragEnd}
                          onTransformEnd={handleTransformEnd}
                          strokeScaleEnabled={false}
                          {...shape.attrs}
                          ref={(node) => {
                            shape.attrs.ref = node;
                          }}
                        />
                      );
                    }
                    if (shape.className == "Arrow") {
                      return (
                        <Arrow
                          key={id}
                          draggable={mode === "selecting"}
                          onClick={handleShapeClick}
                          onDragStart={handleDragStart}
                          onDragEnd={handleDragEnd}
                          onTransformEnd={handleTransformEnd}
                          strokeScaleEnabled={false}
                          {...shape.attrs}
                          ref={(node) => {
                            shape.attrs.ref = node;
                          }}
                        />
                      );
                    }
                    return null;
                  }
                )}
              {localLine && <Line key={currentLineId} {...localLine} />}
              <Transformer ref={transformerRef} />
            </Layer>
          </Stage>
        </div>
      </div>
      <OnlineToggle />
    </div>
  );
}
