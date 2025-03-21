"use client";

import { useContext, useState, useCallback } from "react";
import { BoardContext } from "@/components/board/context/board-context";
import { KonvaNodeSchema, LayerSchema } from "@/types/KonvaNodeSchema";
import Konva from "konva";
import { AnyDocumentId, RawString } from "@automerge/automerge-repo";
import { LineConfig } from "konva/lib/shapes/Line";
import { useClientSync } from "../context/client-doc-context";
import { useDocument } from "@automerge/automerge-repo-react-hooks";

type KonvaEvent = Konva.KonvaEventObject<MouseEvent | TouchEvent>;

const createLine = (
  id: string,
  points: number[],
  color: string,
  size: number
): LineConfig => ({
  id,
  points: points,
  stroke: color,
  strokeWidth: size,
  tension: 0.5,
  lineCap: "round",
  lineJoin: "round",
});

function useDrawing() {
  const { currentLineId, brushColor, brushSize, getPointerPosition } =
    useContext(BoardContext);
  const clientSyncService = useClientSync();
  const [localDoc, changeLocalDoc] = useDocument<LayerSchema>(
    clientSyncService.getDocUrl() as AnyDocumentId
  );
  const [localPoints, setLocalPoints] = useState<number[]>([]);

  const addLineToDoc = useCallback(
    (points: number[]) => {
      changeLocalDoc((doc: LayerSchema) => {
        if (doc[currentLineId]) {
          doc[currentLineId].attrs.points = points;
        }
      });
    },
    [changeLocalDoc, currentLineId]
  );

  const drawLine = (e: KonvaEvent) => {
    const point = getPointerPosition(e);
    if (!point) return;
    setLocalPoints((prev) => [...prev, point.x, point.y]);
  };

  const startLine = (e: KonvaEvent) => {
    const point = getPointerPosition(e);
    if (!point) return;

    const lineAttributes = createLine(
      currentLineId,
      [point.x, point.y],
      brushColor,
      brushSize
    );
    const newLine = new Konva.Line(lineAttributes);
    const lineObject = newLine.toObject() as KonvaNodeSchema;
    lineObject.className = new RawString(lineObject.className);
    changeLocalDoc((doc: LayerSchema) => {
      doc[currentLineId] = lineObject;
    });

    setLocalPoints([point.x, point.y]);
  };

  const endLine = () => {
    addLineToDoc(localPoints);
    setLocalPoints([]);
  };

  return [startLine, drawLine, endLine, localPoints, createLine] as const;
}

export { useDrawing };
