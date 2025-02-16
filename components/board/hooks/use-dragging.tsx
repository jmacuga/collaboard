import { useState } from "react";
import { KonvaEventObject } from "konva/lib/Node";
import { useDocument } from "@automerge/automerge-repo-react-hooks";
import { AnyDocumentId } from "@automerge/automerge-repo";
import { KonvaNodeSchema } from "@/types/KonvaNodeSchema";
import { useClientSync } from "@/components/board/context/client-doc-context";

interface DraggingState {
  draggedLineId: string | null;
  position: { x: number; y: number };
}

export const useDragging = () => {
  const clientSyncService = useClientSync();
  const [doc, changeDoc] = useDocument<KonvaNodeSchema>(
    clientSyncService.getDocUrl() as AnyDocumentId
  );

  const [draggingState, setDraggingState] = useState<DraggingState>({
    draggedLineId: null,
    position: { x: 0, y: 0 },
  });

  const handleDragStart = (e: KonvaEventObject<DragEvent>) => {
    const lineId = e.target.attrs.id;
    setDraggingState({
      draggedLineId: lineId,
      position: e.target.position(),
    });
  };

  const handleDragEnd = (e: KonvaEventObject<DragEvent>) => {
    const lineId = e.target.attrs.id;
    const newPos = e.target.position();
    changeDoc((doc: KonvaNodeSchema) => {
      const line = doc.children?.find(
        (child: KonvaNodeSchema) => child.attrs.id === lineId
      );
      if (line) {
        line.attrs.position = newPos;
      }
    });
    setDraggingState({
      draggedLineId: null,
      position: { x: 0, y: 0 },
    });
  };

  return {
    draggingState,
    handleDragStart,
    handleDragEnd,
  };
};
