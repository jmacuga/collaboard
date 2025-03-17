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
  Text,
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
import { useBoardPanning } from "@/components/board/hooks/use-board-panning";
import { OnlineToggle } from "./components/online-toggle";
import { ResetPositionButton } from "./components/reset-position-button";
import { ShapeColorPalette } from "./components/shape-color-palette";
import { NetworkStatusBadge } from "./components/network-status-badge";
import { useText } from "./hooks/use-text";
import { ActiveUsersList } from "./components/active-users-list";
import { useActiveUsers } from "./hooks/use-active-users";
export default function Board({}: {}) {
  const clientSyncService = useClientSync();
  const docUrl = clientSyncService.getDocUrl() as AnyDocumentId;
  const [localDoc] = useDocument<LayerSchema>(docUrl);
  const handle = useHandle<LayerSchema>(docUrl);

  const {
    brushColor,
    brushSize,
    textColor,
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
  const {
    stagePosition,
    handleBoardPanStart,
    handleBoardPanMove,
    handleBoardPanEnd,
    resetPosition,
  } = useBoardPanning();
  const {
    addText,
    editingText,
    textPosition,
    handleTextBlur,
    handleTextChange,
    handleTextKeyDown,
    textareaRef: textRef,
    setEditingText,
    setTextPosition,
    setCurrentTextId,
  } = useText();

  const { activeUsers } = useActiveUsers();

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
    } else if (mode === "panning") {
      handleBoardPanStart(e);
    } else if (mode === "text") {
      addText(e as Konva.KonvaEventObject<MouseEvent>);
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
    } else if (mode === "panning") {
      handleBoardPanMove(e);
    }
  };

  const handleMouseUp = useCallback(
    (e: Konva.KonvaEventObject<MouseEvent | TouchEvent>) => {
      if (mode === "drawing") {
        isDrawing.current = false;
        endLine();
        setCurrentLineId(uuidv4());
        setLocalLine(null);
      } else if (mode === "erasing") {
        handleEraseEnd();
      } else if (mode === "panning") {
        handleBoardPanEnd(e);
      }
    },
    [endLine, setCurrentLineId, handleEraseEnd, handleBoardPanEnd, mode]
  );

  const handleStageClick = (e: Konva.KonvaEventObject<MouseEvent>) => {
    if (e.target === e.target.getStage()) {
      setSelectedShapeIds([]);

      if (editingText !== null) {
        handleTextBlur();
      }

      const container = document.querySelector(
        ".konvajs-content"
      ) as HTMLElement;
      if (container) {
        if (mode === "panning") {
          container.style.cursor = "grab";
        } else if (mode === "erasing") {
          container.style.cursor = "crosshair";
        } else if (mode === "text") {
          container.style.cursor = "text";
        } else {
          container.style.cursor = "default";
        }
      }
    }
  };

  const handleShapeClick = (e: Konva.KonvaEventObject<MouseEvent>) => {
    if (mode !== "selecting") return;

    e.cancelBubble = true;
    const shapeId = e.target.attrs.id;
    setSelectedShapeIds([shapeId]);
  };

  const handleTextDblClick = (e: Konva.KonvaEventObject<MouseEvent>) => {
    if (mode !== "selecting") return;

    e.cancelBubble = true;
    const textNode = e.target as Konva.Text;
    const textPosition = {
      x: textNode.x(),
      y: textNode.y(),
    };

    setCurrentTextId(textNode.id());
    setTextPosition(textPosition);
    setEditingText(textNode.text());

    setTimeout(() => {
      if (textRef.current) {
        textRef.current.focus();
      }
    }, 10);
  };

  const showResetButton = stagePosition.x !== 0 || stagePosition.y !== 0;

  return (
    <div className="relative w-full h-full">
      <div className="flex h-screen flex-col md:flex-row md:overflow-hidden ">
        <div className="z-10 flex-shrink ">
          <SideToolbar />
        </div>
        {isOnline && activeUsers.length > 0 && (
          <ActiveUsersList users={activeUsers} />
        )}
        <div
          className={`
          ${mode === "erasing" ? "cursor-crosshair" : ""}
          ${mode === "panning" ? "cursor-grab" : ""}
          ${mode === "text" ? "cursor-text" : ""}
          ${
            mode === "selecting" || mode === "drawing" || mode === "shapes"
              ? "cursor-default"
              : ""
          }
        `}
        >
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
            x={stagePosition.x}
            y={stagePosition.y}
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
                    if (shape.className == "Text") {
                      return (
                        <Text
                          key={id}
                          draggable={mode === "selecting"}
                          onClick={handleShapeClick}
                          onDblClick={handleTextDblClick}
                          onDragStart={handleDragStart}
                          onDragEnd={handleDragEnd}
                          onTransformEnd={handleTransformEnd}
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
      {editingText !== null && textPosition && (
        <div
          style={{
            position: "absolute",
            top: textPosition.y + stagePosition.y,
            left: textPosition.x + stagePosition.x,
            zIndex: 9999,
            pointerEvents: "auto",
          }}
        >
          <textarea
            ref={textRef}
            value={editingText}
            onChange={handleTextChange}
            onKeyDown={handleTextKeyDown}
            style={{
              width: "300px",
              minHeight: "50px",
              padding: "5px",
              fontSize: `20px`,
              color: textColor,
              border: "2px solid #0000ff",
              borderRadius: "4px",
              background: "rgba(255, 255, 255, 0.9)",
              resize: "both",
              outline: "none",
              boxShadow: "0 0 10px rgba(0, 0, 255, 0.5)",
            }}
            autoFocus
          />
        </div>
      )}
      <OnlineToggle />
      <NetworkStatusBadge />
      {showResetButton && <ResetPositionButton onClick={resetPosition} />}
      <ShapeColorPalette />
    </div>
  );
}
