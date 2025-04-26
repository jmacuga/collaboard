import { useCallback, useRef } from "react";
import { KonvaEventObject } from "konva/lib/Node";
import Konva from "konva";
import { StageSchema } from "@/types/stage-schema";
import { AnyDocumentId } from "@automerge/automerge-repo";
import { useDocument } from "@automerge/automerge-repo-react-hooks";
import { useCollaborationClient } from "../context/collaboration-client-context";

export const useErasing = () => {
  const collaborationClient = useCollaborationClient();
  const [doc, setDoc] = useDocument<StageSchema>(
    collaborationClient.getDocId() as AnyDocumentId
  );
  const isErasing = useRef(false);

  const handleErase = useCallback(
    (lineId: string) => {
      if (!doc) return;
      setDoc((currentDoc: StageSchema) => {
        if (currentDoc[lineId]) {
          delete currentDoc[lineId];
        }
      });
    },
    [doc, setDoc]
  );

  const handleEraseStart = useCallback(
    (e: KonvaEventObject<MouseEvent>) => {
      isErasing.current = true;
      const target = e.target;
      if (target instanceof Konva.Line) {
        handleErase(target.attrs.id);
      }
    },
    [handleErase]
  );

  const handleEraseMove = useCallback(
    (e: KonvaEventObject<MouseEvent>) => {
      if (!isErasing.current) return;

      const stage = e.target.getStage();
      const pos = stage?.getPointerPosition();
      if (!pos) return;

      const shapes = stage?.getAllIntersections(pos);
      shapes?.forEach((shape) => {
        if (shape instanceof Konva.Line && !(shape instanceof Konva.Arrow)) {
          handleErase(shape.attrs.id);
        }
      });
    },
    [handleErase]
  );

  const handleEraseEnd = useCallback(() => {
    isErasing.current = false;
  }, []);

  return {
    handleEraseStart,
    handleEraseMove,
    handleEraseEnd,
  };
};
