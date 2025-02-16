"use client";

import { useContext, useEffect, useRef, useCallback } from "react";
import Konva from "konva";
import { BoardContext } from "@/components/board/context/board-context";
import { KonvaNodeSchema } from "@/types/KonvaNodeSchema";
import { useClientSync } from "../context/client-doc-context";
import { useDocument } from "@automerge/automerge-repo-react-hooks";
import { AnyDocumentId } from "@automerge/automerge-repo";

export const useTransformer = (localDoc: KonvaNodeSchema | undefined) => {
  const { selectedShapeIds } = useContext(BoardContext);
  const transformerRef = useRef<Konva.Transformer>(null);
  const clientSyncService = useClientSync();
  const [_, changeLocalDoc] = useDocument<KonvaNodeSchema>(
    clientSyncService.getDocUrl() as AnyDocumentId
  );

  const handleTransformEnd = useCallback(
    (e: Konva.KonvaEventObject<Event>) => {
      const node = e.target;
      const shapeId = node.attrs.id;

      changeLocalDoc((doc: KonvaNodeSchema) => {
        if (!doc.children) return;
        const shapeIndex = doc.children.findIndex(
          (child: KonvaNodeSchema) => child.attrs.id === shapeId
        );
        if (shapeIndex === -1) return;

        // Update transform properties
        doc.children[shapeIndex].attrs.x = node.x();
        doc.children[shapeIndex].attrs.y = node.y();
        doc.children[shapeIndex].attrs.scaleX = node.scaleX();
        doc.children[shapeIndex].attrs.scaleY = node.scaleY();
        doc.children[shapeIndex].attrs.rotation = node.rotation();
      });
    },
    [changeLocalDoc]
  );

  useEffect(() => {
    const transformer = transformerRef.current;
    if (transformer) {
      transformer.nodes(
        localDoc?.children
          ?.filter((shape: KonvaNodeSchema) =>
            selectedShapeIds.includes(shape.attrs.id)
          )
          .map((shape: KonvaNodeSchema) => shape.attrs.ref) || []
      );
      transformer.getLayer()?.batchDraw();
    }
  }, [selectedShapeIds, localDoc]);

  return { transformerRef, handleTransformEnd };
};
