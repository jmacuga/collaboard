import { StageSchema } from "@/types/stage-schema";
import { AnyDocumentId } from "@automerge/automerge-repo";
import { useDocument } from "@automerge/automerge-repo-react-hooks";
import { useEffect, useCallback, useContext } from "react";
import { useCollaborationClient } from "../context/collaboration-client-context";
import { BoardContext } from "../context/board-context";

export const useDeleting = () => {
  const { mode, setBoardMode, selectedShapeIds, setSelectedShapeIds } =
    useContext(BoardContext);
  const collaborationClient = useCollaborationClient();
  const [doc, changeDoc] = useDocument<StageSchema>(
    collaborationClient.getDocId() as AnyDocumentId
  );

  const handleDelete = useCallback(() => {
    if (!doc || selectedShapeIds.length === 0) return;

    changeDoc((currentDoc: StageSchema) => {
      selectedShapeIds.forEach((shapeId) => {
        if (currentDoc[shapeId]) {
          delete currentDoc[shapeId];
        }
      });
    });

    setSelectedShapeIds([]);
  }, [doc, selectedShapeIds, changeDoc, setSelectedShapeIds]);

  return { handleDelete };
};
