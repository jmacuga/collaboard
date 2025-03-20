import { KonvaNodeSchema, LayerSchema } from "@/types/KonvaNodeSchema";
import { useDocument } from "@automerge/automerge-repo-react-hooks";
import { AnyDocumentId, RawString } from "@automerge/automerge-repo";
import { useClientSync } from "../context/client-doc-context";
import { KonvaEventObject } from "konva/lib/Node";
import { useContext, useState, useRef } from "react";
import { BoardContext, Point } from "../context/board-context";
import { v4 as uuidv4 } from "uuid";
import { next as Automerge } from "@automerge/automerge";

const useText = () => {
  const clientSyncService = useClientSync();
  const [localDoc, changeDoc] = useDocument<LayerSchema>(
    clientSyncService.getDocUrl() as AnyDocumentId
  );
  const { mode, setMode, textColor, setTextColor, getPointerPosition } =
    useContext(BoardContext);
  const [editingText, setEditingText] = useState<string | null>(null);
  const [textPosition, setTextPosition] = useState<Point | null>(null);
  const [currentTextId, setCurrentTextId] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const updateTextInDoc = (textId: string, text: string) => {
    changeDoc((doc: LayerSchema) => {
      if (doc[textId]) {
        const path = [textId, "attrs", "text"];
        Automerge.updateText(doc, path, text);
        return doc;
      }
    });
  };

  const addTextToDoc = (textId: string, text: string) => {
    if (!textPosition) {
      console.error("Could not get text position");
      return;
    }
    changeDoc((doc: LayerSchema) => {
      doc[textId] = {
        className: new RawString("Text"),
        attrs: {
          id: textId,
          x: textPosition.x,
          y: textPosition.y,
          text: text,
          fontSize: 20,
          fill: textColor,
          width: 300,
        },
      };
      return doc;
    });
  };

  const addText = (e: KonvaEventObject<MouseEvent>) => {
    const point = getPointerPosition(e);
    console.log("point", point);
    if (!point) {
      console.error("Could not get pointer position");
      return;
    }

    const textId = uuidv4();
    setCurrentTextId(textId);
    setTextPosition(point);
    setEditingText("");
    console.log("textareaRef", textareaRef.current);
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
      }
    }, 10);
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditingText(e.target.value);
  };

  const handleTextBlur = () => {
    if (editingText !== null && textPosition) {
      if (currentTextId) {
        if (localDoc && localDoc[currentTextId]) {
          updateTextInDoc(currentTextId, editingText);
        } else {
          addTextToDoc(currentTextId, editingText);
        }
      }
      setMode("selecting");
    }

    setEditingText(null);
    setTextPosition(null);
    setCurrentTextId(null);

    if (mode !== "text") {
      setMode("selecting");
    }
  };

  const handleTextKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleTextBlur();
    }
  };

  return {
    addText,
    editingText,
    textPosition,
    handleTextBlur,
    handleTextChange,
    handleTextKeyDown,
    textareaRef,
    currentTextId,
    setEditingText,
    setTextPosition,
    setCurrentTextId,
  };
};

export { useText };
