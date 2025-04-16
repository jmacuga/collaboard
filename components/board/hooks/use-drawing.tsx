"use client";

import { useContext, useState, useCallback } from "react";
import { BoardContext } from "@/components/board/context/board-context";
import { KonvaNodeSchema, LayerSchema } from "@/types/KonvaNodeSchema";
import Konva from "konva";
import { AnyDocumentId, RawString } from "@automerge/automerge-repo";
import { LineConfig } from "konva/lib/shapes/Line";
import { useCollaborationClient } from "../context/collaboration-client-context";
import { useDocument } from "@automerge/automerge-repo-react-hooks";
import { KonvaEventObject } from "konva/lib/Node";

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
  const {
    currentLineId,
    brushColor,
    brushSize,
    getPointerPosition,
    localPoints,
    setLocalPoints,
  } = useContext(BoardContext);
  const collaborationClient = useCollaborationClient();
  const [localDoc, changeLocalDoc] = useDocument<LayerSchema>(
    collaborationClient.getDocId() as AnyDocumentId
  );

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

  const drawLine = (e: KonvaEventObject<MouseEvent>) => {
    const point = getPointerPosition(e);
    if (!point) return;
    setLocalPoints((prev) => [...prev, point.x, point.y]);
  };

  const startLine = (e: KonvaEventObject<MouseEvent>) => {
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

  return { startLine, drawLine, endLine, localPoints, createLine };
}

export { useDrawing };
