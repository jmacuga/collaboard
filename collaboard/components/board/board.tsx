"use client";
import SideToolbar from "@/components/canvas/side-toolbar";
import { useRef, useEffect, useState, useContext, useCallback } from "react";
import { Stage, Layer, Line, Shape, Rect } from "react-konva";
import * as A from "@automerge/automerge-repo";
import { BoardContext } from "@/context/boardContext";
// import { useSocket } from "@/lib/hooks/useSocket";
// import { useDrawLine, useStartLine } from "@/components/canvas/hooks/lineHooks";
// import { v4 as uuidv4 } from "uuid";
import { IStage } from "@/models/Stage";
import { useDocument } from "@automerge/automerge-repo-react-hooks";
import { uuid } from "@automerge/automerge";
import Konva from "konva";
import KonvaNodeObject from "@/types/KonvaNodeObject";

export default function Board({ docUrl }: { docUrl: A.AutomergeUrl }) {
  const [message, setMessage] = useState<string | undefined>(undefined);
  const [doc, changeDoc] = useDocument<KonvaNodeObject>(docUrl);
  const {
    lines,
    setLines,
    brushColor,
    setBrushColor,
    currentLineId,
    setCurrentLineId,
  } = useContext(BoardContext);

  //   const { joinRoom, addShapeEmit } = useSocket({ roomId });
  //   const [mode, setMode] = useState("selecting");
  //   const modeStateRef = useRef(mode);
  //   const [tool, setTool] = useState("pen");
  //   const isDrawing = useRef(false);
  //   const [startLine] = useStartLine({ tool, brushColor });
  //   const [drawLine] = useDrawLine();
  //   useEffect(() => {
  //     const objects = stage.objects;
  //     if (objects.length > 0) {
  //       setLines(new Map(objects.map((obj) => [obj.id, obj])));
  //     }
  //     joinRoom();
  //   }, []);
  //   useEffect(() => {
  //     modeStateRef.current = mode;
  //   }, [mode]);
  //   function setCursorMode(new_mode: string) {
  //     setMode(new_mode);
  //   }
  //   const handleMouseDown = (e) => {
  //     if (mode == "drawing") {
  //       isDrawing.current = true;
  //       startLine(e);
  //     }
  //   };
  //   const handleMouseMove = (e) => {
  //     if (mode === "drawing") {
  //       if (!isDrawing.current) {
  //         return;
  //       }
  //       drawLine(e);
  //     }
  //   };
  //   const handleMouseUp = useCallback(() => {
  //     if (mode === "drawing") {
  //       isDrawing.current = false;
  //       addShapeEmit({ shape: lines.get(currentLineId) });
  //       setCurrentLineId(uuidv4());
  //     }
  //   }, [mode, lines, currentLineId]);

  return (
    <div className="flex h-screen flex-col md:flex-row md:overflow-hidden ">
      <div className="z-10 flex-shrink ">
        <SideToolbar
        // setCursorMode={setCursorMode}
        // changeBrushColor={setBrushColor}
        // cursorMode={mode}
        />
      </div>
      <div className="flex-grow md:overflow-y-auto">
        <Stage
          key={uuid()}
          width={window.innerWidth}
          height={window.innerHeight}
          // onMouseDown={handleMouseDown}
          // onTouchStart={handleMouseDown}
          // onMouseMove={handleMouseMove}
          // onTouchMove={handleMouseMove}
          // onMouseUp={handleMouseUp}
          // onTouchEnd={handleMouseUp}
        >
          <Layer key={uuid()}>
            {doc?.children?.map((shape) => {
              if (shape.className == "Line") {
                return <Line key={uuid()} {...shape.attrs}></Line>;
              }
            })}
          </Layer>
        </Stage>
      </div>
    </div>
  );
}
