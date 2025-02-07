"use client";

import { useContext, useState, useCallback } from "react";
import { BoardContext } from "@/context/boardContext";
import { useDocument } from "@automerge/automerge-repo-react-hooks";
import KonvaNodeSchema from "@/types/KonvaNodeSchema";
import Konva from "konva";
import { AnyDocumentId } from "@automerge/automerge-repo";
import { throttle } from "lodash";

type KonvaEvent = Konva.KonvaEventObject<MouseEvent | TouchEvent>;

interface Point {
  x: number;
  y: number;
}

interface LineAttributes {
  id: string;
  points: number[];
  stroke: string;
  strokeWidth: number;
}

const createLine = (
  id: string,
  point: Point,
  color: string
): LineAttributes => ({
  id,
  points: [point.x, point.y],
  stroke: color,
  strokeWidth: 5,
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
    throttle((points: number[]) => {
      changeDoc((doc) => {
        if (!doc.children) doc.children = [];
        const currentLineIndex = doc.children.findIndex(
          (child) => child.attrs.id === currentLineId
        );
        if (currentLineIndex === -1) return;

        doc.children[currentLineIndex].attrs.points.push(...points);
      });
    }, 50),
    [changeDoc, currentLineId]
  );

  const drawLine = (e: KonvaEvent) => {
    if (!doc?.children) return;

    const point = getPointerPosition(e);
    if (!point) return;

    setLocalPoints((prev) => [...prev, point.x, point.y]);

    updateAutomerge([point.x, point.y]);
  };

  const startLine = (e: KonvaEvent) => {
    const point = getPointerPosition(e);
    if (!point) return;

    const lineAttributes = createLine(currentLineId, point, brushColor);
    const newLine = new Konva.Line(lineAttributes);

    changeDoc((doc) => {
      if (!doc.children) doc.children = [];
      doc.children.push(newLine.toObject() as KonvaNodeSchema);
    });
  };

  return [startLine, drawLine, localPoints] as const;
}

export { useDrawing };
