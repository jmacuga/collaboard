import { KonvaNodeSchema, LayerSchema } from "@/types/KonvaNodeSchema";
import { useDocument } from "@automerge/automerge-repo-react-hooks";
import { AnyDocumentId } from "@automerge/automerge-repo";
import { useClientSync } from "../context/client-doc-context";
import { KonvaEventObject } from "konva/lib/Node";
import { Vector2d } from "konva/lib/types";
import Konva from "konva";
import { useContext, useState, useRef } from "react";
import { BoardContext } from "../context/board-context";
import { v4 as uuidv4 } from "uuid";
import { next as Automerge } from "@automerge/automerge";

type Point = Vector2d;

const getPointerPosition = (e: KonvaEventObject<MouseEvent>): Point | null => {
  const stage = e.target.getStage();
  return stage?.getPointerPosition() ?? null;
};

const updateAutomergeText = (
  doc: LayerSchema,
  textId: string,
  text: string
) => {
  const path = [textId, "attrs", "text"];
  Automerge.updateText(doc, path, text);
  return doc;
};

const useText = () => {
  const clientSyncService = useClientSync();
  const [localDoc, changeDoc] = useDocument<LayerSchema>(
    clientSyncService.getDocUrl() as AnyDocumentId
  );
  const { brushColor, brushSize, mode, setMode } = useContext(BoardContext);
  const [editingText, setEditingText] = useState<string | null>(null);
  const [textPosition, setTextPosition] = useState<Point | null>(null);
  const [currentTextId, setCurrentTextId] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const addText = (e: KonvaEventObject<MouseEvent>) => {
    const point = getPointerPosition(e);
    console.log("addText called, point:", point);

    if (!point) {
      console.error("Could not get pointer position");
      return;
    }

    // Create a unique ID for this text
    const textId = uuidv4();
    console.log("Generated text ID:", textId);

    // Set the current text ID
    setCurrentTextId(textId);

    // Set the position for the textarea
    console.log("Setting text position:", point);
    setTextPosition(point);

    // Start editing with an empty string
    console.log("Setting editing text to empty string");
    setEditingText("");

    // Focus the textarea when it's rendered
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
    console.log("Text blur event triggered", {
      editingText,
      textPosition,
      currentTextId,
      mode,
    });

    // If we have valid content to add or update
    if (editingText !== null && textPosition && editingText.trim() !== "") {
      console.log("Saving text:", editingText);

      // Check if we're updating an existing text node
      if (currentTextId && localDoc && localDoc[currentTextId]) {
        console.log("Updating existing text node:", currentTextId);
        changeDoc((doc: LayerSchema) => {
          if (doc[currentTextId]) {
            updateAutomergeText(doc, currentTextId, editingText);
          }
          return doc;
        });
      } else {
        // Create a new text node
        console.log("Creating new text node");
        const textId = currentTextId || uuidv4();
        changeDoc((doc: LayerSchema) => {
          doc[textId] = {
            className: "Text",
            attrs: {
              id: textId,
              x: textPosition.x,
              y: textPosition.y,
              text: editingText,
              fontSize: 20,
              fill: brushColor,
              width: 300,
            },
          };
          return doc;
        });
      }

      setMode("selecting");
    } else {
      console.log("No text to save or empty text");
    }

    // Reset the editing state
    setEditingText(null);
    setTextPosition(null);
    setCurrentTextId(null);

    // Only switch back to selecting mode if we're not in text mode
    // This allows users to continue adding text in text mode
    if (mode !== "text") {
      console.log("Switching back to selecting mode");
      setMode("selecting");
    } else {
      console.log("Staying in text mode");
    }
  };

  const handleTextKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Submit on Enter (without shift)
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
