import { KonvaNodeSchema, StageSchema } from "@/types/stage-schema";
import { useDocument } from "@automerge/automerge-repo-react-hooks";
import { AnyDocumentId, RawString } from "@automerge/automerge-repo";
import { useCollaborationClient } from "../context/collaboration-client-context";
import { KonvaEventObject } from "konva/lib/Node";
import { useContext, useState, useRef } from "react";
import { BoardContext, Point } from "../context/board-context";
import { v4 as uuidv4 } from "uuid";
import { next as Automerge } from "@automerge/automerge";

const useText = () => {
  const collaborationClient = useCollaborationClient();
  const [localDoc, changeDoc] = useDocument<StageSchema>(
    collaborationClient.getDocId() as AnyDocumentId
  );
  const {
    mode,
    setBoardMode,
    textColor,
    getPointerPosition,
    editingText,
    setEditingText,
    textPosition,
    setTextPosition,
    currentTextId,
    setCurrentTextId,
    textareaRef,
  } = useContext(BoardContext);

  const updateTextInDoc = (textId: string, text: string) => {
    changeDoc((doc: StageSchema) => {
      if (doc[textId]) {
        const path = [textId, "attrs", "text"];
        if (text === "") {
          delete doc[textId];
        } else {
          Automerge.updateText(doc, path, text);
        }
        return doc;
      }
    });
  };

  const addTextToDoc = (textId: string, text: string) => {
    if (!textPosition) {
      console.error("Could not get text position");
      return;
    }
    changeDoc((doc: StageSchema) => {
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
    if (!point) {
      console.error("Could not get pointer position");
      return;
    }

    const textId = uuidv4();
    setCurrentTextId(textId);
    setTextPosition(point);
    setEditingText("");
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
    }

    setEditingText(null);
    setTextPosition(null);
    setCurrentTextId(null);
    setBoardMode("selecting");
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
  };
};

export { useText };
