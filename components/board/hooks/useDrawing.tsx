"use client";

import { useContext, useState, useCallback } from "react";
import { BoardContext } from "@/context/boardContext";
import { useDocument } from "@automerge/automerge-repo-react-hooks";
import { KonvaNodeSchema } from "@/types/KonvaNodeSchema";
import Konva from "konva";
import { AnyDocumentId } from "@automerge/automerge-repo";
import { LineConfig } from "konva/lib/shapes/Line";
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
});

const getPointerPosition = (e: KonvaEvent): Point | null => {
  const stage = e.target.getStage();
  return stage?.getPointerPosition() ?? null;
};

function useDrawing({ docUrl }: { docUrl: string }) {
  const { currentLineId, brushColor } = useContext(BoardContext);
  const [doc, changeDoc] = useDocument<KonvaNodeSchema>(
    docUrl as AnyDocumentId
  );

  const [localPoints, setLocalPoints] = useState<number[]>([]);

  const updateAutomerge = useCallback(
    (points: number[]) => {
      changeDoc((doc) => {
        if (!doc.children) doc.children = [];
        const currentLineIndex = doc.children.findIndex(
          (child) => child.attrs.id === currentLineId
        );
        if (currentLineIndex === -1) return;
        doc.children[currentLineIndex].attrs.points = points;
      });
    },
    [changeDoc, currentLineId]
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

    changeDoc((doc: KonvaNodeSchema) => {
      console.log("changeDoc");
      console.log("doc", doc);
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
