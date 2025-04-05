import { useState } from "react";
import { KonvaEventObject } from "konva/lib/Node";
import { useDocument } from "@automerge/automerge-repo-react-hooks";
import { AnyDocumentId } from "@automerge/automerge-repo";
import { KonvaNodeSchema, LayerSchema } from "@/types/KonvaNodeSchema";
import { useClientSync } from "@/components/board/context/client-sync-context";

interface DraggingState {
  draggedShapeId: string | null;
  x: number;
  y: number;
}

export const useDragging = () => {
  const clientSyncService = useClientSync();
  const [doc, changeDoc] = useDocument<LayerSchema>(
    clientSyncService.getDocId() as AnyDocumentId
  );

  const [draggingState, setDraggingState] = useState<DraggingState>({
    draggedShapeId: null,
    x: 0,
    y: 0,
  });

  const handleDragStart = (e: KonvaEventObject<MouseEvent>) => {
    const shapeId = e.target.attrs.id;
    setDraggingState({
      draggedShapeId: shapeId,
      x: e.target.x(),
      y: e.target.y(),
    });
  };

  const handleDragEnd = (e: KonvaEventObject<MouseEvent>) => {
    const shapeId = e.target.attrs.id;
    const newPos = { x: e.target.x(), y: e.target.y() };
    changeDoc((doc: LayerSchema) => {
      if (doc[shapeId]) {
        doc[shapeId].attrs.x = newPos.x;
        doc[shapeId].attrs.y = newPos.y;
      }
    });
    setDraggingState({
      draggedShapeId: null,
      x: 0,
      y: 0,
    });
  };

  return {
    draggingState,
    handleDragStart,
    handleDragEnd,
  };
};
