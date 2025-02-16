"use client";

import { useContext, useEffect, useRef } from "react";
import Konva from "konva";
import { BoardContext } from "@/components/board/context/board-context";
import { KonvaNodeSchema } from "@/types/KonvaNodeSchema";

export const useTransformer = (localDoc: KonvaNodeSchema | undefined) => {
  const { selectedShapeIds } = useContext(BoardContext);
  const transformerRef = useRef<Konva.Transformer>(null);

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

  return { transformerRef };
};
