"use client";

import { useContext, useEffect, useRef, useCallback } from "react";
import Konva from "konva";
import { BoardContext } from "@/components/board/context/board-context";
import { StageSchema } from "@/types/stage-schema";
import { useCollaborationClient } from "../context/collaboration-client-context";
import { useDocument } from "@automerge/automerge-repo-react-hooks";
import { AnyDocumentId } from "@automerge/automerge-repo";

export const useTransformer = (localDoc: StageSchema | undefined) => {
  const { selectedShapeIds } = useContext(BoardContext);
  const transformerRef = useRef<Konva.Transformer>(null);
  const collaborationClient = useCollaborationClient();
  const [_, changeLocalDoc] = useDocument<StageSchema>(
    collaborationClient.getDocId() as AnyDocumentId
  );

  const handleTransformEnd = useCallback(
    (e: Konva.KonvaEventObject<Event>) => {
      const node = e.target;
      const shapeId = node.attrs.id;

      changeLocalDoc((doc: StageSchema) => {
        if (!doc[shapeId]) return;
        console.log("doc", doc);
        const shape = doc[shapeId];
        const attrs = node.attrs;

        console.log("attrs", attrs);
        console.log("shape.attrs", shape.attrs);

        function roundTo5Decimals(value: number) {
          return Math.round(value * 100000) / 100000;
        }
        if (roundTo5Decimals(shape.attrs.x) !== roundTo5Decimals(attrs.x)) {
          shape.attrs.x = attrs.x ?? 0;
        }

        if (roundTo5Decimals(shape.attrs.y) !== roundTo5Decimals(attrs.y)) {
          shape.attrs.y = attrs.y ?? 0;
        }
        if (
          roundTo5Decimals(shape.attrs.scaleX) !==
          roundTo5Decimals(attrs.scaleX)
        ) {
          shape.attrs.scaleX = attrs.scaleX ?? 1;
        }
        if (
          roundTo5Decimals(shape.attrs.scaleY) !==
          roundTo5Decimals(attrs.scaleY)
        ) {
          shape.attrs.scaleY = attrs.scaleY ?? 1;
        }
        if (
          roundTo5Decimals(shape.attrs.rotation) !==
          roundTo5Decimals(attrs.rotation)
        ) {
          shape.attrs.rotation = attrs.rotation ?? 0;
        }
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
