"use client";

import { useContext, useState, useCallback } from "react";
import { BoardContext } from "@/components/board/context/board-context";
import { KonvaNodeSchema } from "@/types/KonvaNodeSchema";
import Konva from "konva";
import { AnyDocumentId } from "@automerge/automerge-repo";
import { LineConfig } from "konva/lib/shapes/Line";
import { useClientSync } from "../context/client-doc-context";
import { useDocument } from "@automerge/automerge-repo-react-hooks";

type KonvaEvent = Konva.KonvaEventObject<MouseEvent | TouchEvent>;
interface Point {
  x: number;
  y: number;
}

const createLine = (
  id: string,
  points: number[],
  color: string
): LineConfig => ({
  id,
  points: points,
  stroke: color,
  strokeWidth: 5,
  tension: 0.5,
  lineCap: "round",
  lineJoin: "round",
  draggable: true,
});

const getPointerPosition = (e: KonvaEvent): Point | null => {
  const stage = e.target.getStage();
  return stage?.getPointerPosition() ?? null;
};

function useDrawing() {
  const { currentLineId, brushColor } = useContext(BoardContext);
  const clientSyncService = useClientSync();
  const [localDoc, changeLocalDoc] = useDocument<KonvaNodeSchema>(
    clientSyncService.getDocUrl() as AnyDocumentId
  );
  const [localPoints, setLocalPoints] = useState<number[]>([]);

  const updateAutomerge = useCallback(
    (points: number[]) => {
      changeLocalDoc((doc: KonvaNodeSchema) => {
        if (!doc.children) doc.children = [];
        const currentLineIndex = doc.children.findIndex(
          (child: KonvaNodeSchema) => child.attrs.id === currentLineId
        );
        if (currentLineIndex === -1) return;
        doc.children[currentLineIndex].attrs.points = points;
      });
    },
    [changeLocalDoc, currentLineId]
  );

  const drawLine = (e: KonvaEvent) => {
    // if (!doc?.children) return;

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
      brushColor
    );
    const newLine = new Konva.Line(lineAttributes);

    changeLocalDoc((doc: KonvaNodeSchema) => {
      if (!doc.children) doc.children = [];
      doc.children.push(newLine.toObject() as KonvaNodeSchema);
    });

    setLocalPoints([point.x, point.y]);
  };

  const endLine = () => {
    updateAutomerge(localPoints);
    setLocalPoints([]);
  };

  return [startLine, drawLine, endLine, localPoints, createLine] as const;
}

export { useDrawing };
