import { useState } from "react";
import { KonvaEventObject } from "konva/lib/Node";
import { useDocument } from "@automerge/automerge-repo-react-hooks";
import { AnyDocumentId } from "@automerge/automerge-repo";
import { KonvaNodeSchema } from "@/types/KonvaNodeSchema";
import { useClientSync } from "@/components/board/context/client-doc-context";

interface DraggingState {
  draggedShapeId: string | null;
  x: number;
  y: number;
}

export const useDragging = () => {
  const clientSyncService = useClientSync();
  const [doc, changeDoc] = useDocument<KonvaNodeSchema>(
    clientSyncService.getDocUrl() as AnyDocumentId
  );

  const [draggingState, setDraggingState] = useState<DraggingState>({
    draggedShapeId: null,
    x: 0,
    y: 0,
  });

  const handleDragStart = (e: KonvaEventObject<DragEvent>) => {
    const shapeId = e.target.attrs.id;
    setDraggingState({
      draggedShapeId: shapeId,
      x: e.target.x(),
      y: e.target.y(),
    });
  };

  const handleDragEnd = (e: KonvaEventObject<DragEvent>) => {
    const shapeId = e.target.attrs.id;
    const newPos = { x: e.target.x(), y: e.target.y() };
    changeDoc((doc: KonvaNodeSchema) => {
      const shape = doc.children?.find(
        (child: KonvaNodeSchema) => child.attrs.id === shapeId
      );
      if (shape) {
        shape.attrs.x = newPos.x;
        shape.attrs.y = newPos.y;
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
