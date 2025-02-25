import { KonvaNodeSchema, LayerSchema } from "@/types/KonvaNodeSchema";
import { useDocument } from "@automerge/automerge-repo-react-hooks";
import { AnyDocumentId } from "@automerge/automerge-repo";
import { useClientSync } from "../context/client-doc-context";
import { KonvaEventObject } from "konva/lib/Node";
import { Vector2d } from "konva/lib/types";
import Konva from "konva";
import { useContext, useEffect } from "react";
import { BoardContext } from "../context/board-context";
import { v4 as uuidv4 } from "uuid";
import { RawString } from "@automerge/automerge-repo";
type Point = Vector2d;

const getPointerPosition = (e: KonvaEventObject<MouseEvent>): Point | null => {
  const stage = e.target.getStage();
  return stage?.getPointerPosition() ?? null;
};

const useShape = () => {
  const clientSyncService = useClientSync();
  const [doc, changeDoc] = useDocument<LayerSchema>(
    clientSyncService.getDocUrl() as AnyDocumentId
  );
  const { shapeColor, shapeType } = useContext(BoardContext);
  const addToAutomerge = (shape: KonvaNodeSchema) => {
    shape = objectStringToRawString(shape);
    const shapeId = shape.attrs.id;
    changeDoc((doc: LayerSchema) => {
      doc[shapeId] = shape;
    });
  };

  const objectStringToRawString = (obj: any) => {
    Object.keys(obj).forEach((key) => {
      if (typeof obj[key] === "string") {
        obj[key] = new RawString(obj[key]);
      }
    });
    return obj;
  };

  const addShape = (e: KonvaEventObject<MouseEvent>) => {
    const point = getPointerPosition(e);
    if (!point) return;
    let shape: Konva.Rect | Konva.Circle | Konva.Arrow | null | any = null;
    if (shapeType === "rectangle") {
      shape = new Konva.Rect({
        id: uuidv4(),
        x: point.x - 50,
        y: point.y - 50,
        width: 100,
        height: 100,
        stroke: shapeColor,
        strokeWidth: 3,
        cornerRadius: 10,
      });
    }
    if (shapeType === "circle") {
      shape = new Konva.Circle({
        id: uuidv4(),
        x: point.x - 25,
        y: point.y - 25,
        radius: 50,
        stroke: shapeColor,
        strokeWidth: 3,
      });
      console.log(shape);
    }
    if (shapeType === "arrow") {
      shape = new Konva.Arrow({
        id: uuidv4(),
        x: point.x - 50,
        y: point.y,
        points: [0, 0, 100, 0],
        stroke: shapeColor,
        strokeWidth: 3,
        fill: shapeColor,
        lineCap: "round",
        lineJoin: "round",
      });
    }
    if (shape) {
      addToAutomerge(shape.toObject() as KonvaNodeSchema);
    }
  };

  return { addShape };
};

export { useShape };
