import { LayerSchema } from "@/types/KonvaNodeSchema";
import { AnyDocumentId } from "@automerge/automerge-repo";
import { useDocument } from "@automerge/automerge-repo-react-hooks";
import { useEffect, useCallback, useContext } from "react";
import { useClientSync } from "../context/client-doc-context";
import { BoardContext } from "../context/board-context";

export const useDeleting = () => {
  const { mode, setBoardMode, selectedShapeIds, setSelectedShapeIds } =
    useContext(BoardContext);
  const clientSyncService = useClientSync();
  const [doc, changeDoc] = useDocument<LayerSchema>(
    clientSyncService.getDocUrl() as AnyDocumentId
  );

  const handleDelete = useCallback(() => {
    if (!doc || selectedShapeIds.length === 0) return;

    changeDoc((currentDoc: LayerSchema) => {
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
