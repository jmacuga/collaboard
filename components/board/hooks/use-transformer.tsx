"use client";

import { useContext, useEffect, useRef, useCallback } from "react";
import Konva from "konva";
import { BoardContext } from "@/components/board/context/board-context";
import { LayerSchema } from "@/types/KonvaNodeSchema";
import { useClientSync } from "../context/client-doc-context";
import { useDocument } from "@automerge/automerge-repo-react-hooks";
import { AnyDocumentId } from "@automerge/automerge-repo";

export const useTransformer = (localDoc: LayerSchema | undefined) => {
  const { selectedShapeIds } = useContext(BoardContext);
  const transformerRef = useRef<Konva.Transformer>(null);
  const clientSyncService = useClientSync();
  const [_, changeLocalDoc] = useDocument<LayerSchema>(
    clientSyncService.getDocUrl() as AnyDocumentId
  );

  const handleTransformEnd = useCallback(
    (e: Konva.KonvaEventObject<Event>) => {
      const node = e.target;
      const shapeId = node.attrs.id;

      changeLocalDoc((doc: LayerSchema) => {
        if (!doc[shapeId]) return;

        const shape = doc[shapeId];
        const attrs = node.attrs;

        shape.attrs.x = attrs.x ?? 0;
        shape.attrs.y = attrs.y ?? 0;
        shape.attrs.scaleX = attrs.scaleX ?? 1;
        shape.attrs.scaleY = attrs.scaleY ?? 1;
        shape.attrs.rotation = attrs.rotation ?? 0;
      });
    },
    [changeLocalDoc]
  );

  useEffect(() => {
    const transformer = transformerRef.current;
    if (transformer) {
      transformer.ignoreStroke(true);

      const nodes = localDoc
        ? Object.entries(localDoc)
            .filter(([id, shape]) => selectedShapeIds.includes(id))
            .map(([_, shape]) => shape.attrs.ref)
        : [];

      transformer.nodes(nodes);
      transformer.getLayer()?.batchDraw();
    }
  }, [selectedShapeIds, localDoc]);

  return { transformerRef, handleTransformEnd };
};
