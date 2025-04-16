"use client";
import { useEffect, useContext } from "react";
import { Stage, Layer, Line, Transformer } from "react-konva";
import { BoardContext } from "@/components/board/context/board-context";
import { useDrawing } from "@/components/board/hooks/use-drawing";
import { KonvaNodeSchema, LayerSchema } from "@/types/KonvaNodeSchema";
import { useDocument } from "@automerge/automerge-repo-react-hooks";
import { AnyDocumentId } from "@automerge/automerge-repo";
import { useTransformer } from "@/components/board/hooks/use-transformer";
import { useText } from "@/components/board/hooks/use-text";
import {
  ActiveUser,
  useActiveUsers,
} from "@/components/board/hooks/use-active-users";
import { useBoardInteractions } from "@/components/board/hooks/use-board-interactions";
import { ShapeRenderer } from "@/components/board/components/shape-renderer";
import { ObjectEditIndicator } from "@/components/board/components/object-edit-indicator";
import { BoardMode } from "@/types/board";
import SideToolbar from "@/components/board/side-toolbar";
import { ActiveUsersList } from "@/components/board/components/active-users-list";
import { ResetPositionButton } from "@/components/board/components/reset-position-button";
import { ShapeColorPalette } from "@/components/board/components/shape-color-palette";
import { LocalChangesHeader } from "@/components/board/components/local-changes-header";
import { KonvaEventObject } from "konva/lib/Node";
import { Text } from "konva/lib/shapes/Text";
import { useWindowDimensions } from "@/components/board/hooks/use-window-dimensions";
import { Team as PrismaTeam, Board as PrismaBoard } from "@prisma/client";
import { useCollaborationClient } from "./context/collaboration-client-context";

export default function Board({
  team,
  board,
  hideActiveUsers = false,
}: {
  team: PrismaTeam;
  board: PrismaBoard;
  hideActiveUsers?: boolean;
}) {
  const collaborationClient = useCollaborationClient();
  const docId = collaborationClient.getDocId() as AnyDocumentId;
  const [localDoc] = useDocument<LayerSchema>(docId);
  const { width, height } = useWindowDimensions();

  const {
    brushColor,
    brushSize,
    textColor,
    currentLineId,
    mode,
    isRealTime,
    stagePosition,
    resetStagePosition,
    editingText,
    textPosition,
    setEditingText,
    setTextPosition,
    setCurrentTextId,
    textareaRef,
  } = useContext(BoardContext);

  let activeUsers: ActiveUser[] = [];
  let objectEditors: Record<string, ActiveUser[]> = {};
  if (!hideActiveUsers) {
    const userStatus = useActiveUsers();
    activeUsers = userStatus.activeUsers;
    objectEditors = userStatus.objectEditors ?? {};
  }
  const { localPoints } = useDrawing();
  const { transformerRef, handleTransformEnd } = useTransformer(localDoc);
  const { handleTextChange, handleTextKeyDown } = useText();

  const {
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleStageClick,
    handleShapeMouseDown,
    handleDragStart,
    handleDragEnd,
    handleKeyDown,
  } = useBoardInteractions();
  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const handleTextDblClick = (e: KonvaEventObject<MouseEvent>) => {
    if (mode !== "selecting") return;

    e.cancelBubble = true;
    const textNode = e.target as Text;
    const textId = textNode.id();

    if (
      objectEditors &&
      objectEditors[textId] &&
      objectEditors[textId].length > 0
    ) {
      return;
    }

    const textPosition = {
      x: textNode.x(),
      y: textNode.y(),
    };

    setCurrentTextId(textId);
    setTextPosition(textPosition);
    setEditingText(textNode.text());

    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
      }
    }, 10);
  };

  const showResetButton = stagePosition.x !== 0 || stagePosition.y !== 0;

  return (
    <>
      <LocalChangesHeader />
      <div className="flex flex-1 md:overflow-hidden">
        <div className="z-10 flex-shrink">
          <SideToolbar teamId={team.id} />
        </div>
        {!hideActiveUsers &&
          isRealTime &&
          activeUsers &&
          activeUsers.length > 0 && <ActiveUsersList users={activeUsers} />}
        <div>
          <Stage
            width={width}
            height={height}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onClick={handleStageClick}
            x={stagePosition.x}
            y={stagePosition.y}
          >
            <Layer>
              {isRealTime &&
                localDoc &&
                objectEditors &&
                Object.entries(objectEditors).map(([objectId, editors]) => (
                  <ObjectEditIndicator
                    key={`edit-indicator-${objectId}`}
                    objectId={objectId}
                    editors={editors}
                    shape={localDoc[objectId]}
                  />
                ))}
              {localDoc &&
                (Object.entries(localDoc) as [string, KonvaNodeSchema][]).map(
                  ([id, shape]) => (
                    <ShapeRenderer
                      key={id}
                      id={id}
                      shape={shape}
                      mode={mode as BoardMode}
                      onMouseDown={handleShapeMouseDown}
                      onDragStart={handleDragStart}
                      onDragEnd={handleDragEnd}
                      onTransformEnd={handleTransformEnd}
                      onTextDblClick={handleTextDblClick}
                    />
                  )
                )}
              {localPoints && localPoints.length > 0 && (
                <Line
                  key={currentLineId}
                  points={localPoints}
                  stroke={brushColor}
                  strokeWidth={brushSize}
                  lineCap="round"
                  lineJoin="round"
                  tension={0.5}
                />
              )}
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
            ref={textareaRef}
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
      <div className="fixed bottom-7 right-72 z-40 flex items-center">
        {showResetButton && (
          <ResetPositionButton onClick={resetStagePosition} />
        )}
        <ShapeColorPalette />
      </div>
    </>
  );
}
