import { ShapeConfig } from "konva/lib/Shape";

import { KonvaNodeSchema } from "@/types/KonvaNodeSchema";
import { RectConfig } from "konva/lib/shapes/Rect";
import { useDocument } from "@automerge/automerge-repo-react-hooks";
import { AnyDocumentId } from "@automerge/automerge-repo";
import { useClientSync } from "../context/client-doc-context";
import { KonvaEventObject } from "konva/lib/Node";
import { Vector2d } from "konva/lib/types";
import Konva from "konva";
import { useContext } from "react";
import { BoardContext } from "../context/board-context";
import { v4 as uuidv4 } from "uuid";

type Point = Vector2d;

const getPointerPosition = (e: KonvaEventObject<MouseEvent>): Point | null => {
  const stage = e.target.getStage();
  return stage?.getPointerPosition() ?? null;
};

const useShape = () => {
  const clientSyncService = useClientSync();
  const [doc, changeDoc] = useDocument<KonvaNodeSchema>(
    clientSyncService.getDocUrl() as AnyDocumentId
  );
  const { currentLineId, setCurrentLineId } = useContext(BoardContext);

  const addToAutomerge = (shape: KonvaNodeSchema) => {
    changeDoc((doc: KonvaNodeSchema) => {
      doc.children?.push(shape);
    });
  };

  const addRect = (e: KonvaEventObject<MouseEvent>) => {
    const point = getPointerPosition(e);
    if (!point) return;
    const rect = new Konva.Rect({
      id: uuidv4(),
      x: point.x - 50,
      y: point.y - 50,
      width: 100,
      height: 100,
      fill: "red",
      stroke: "black",
      strokeWidth: 1,
      cornerRadius: 10,
    });

    addToAutomerge(rect.toObject() as KonvaNodeSchema);
  };

  return { addRect };
};

export { useShape };
