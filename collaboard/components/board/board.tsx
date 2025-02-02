"use client";
import SideToolbar from "@/components/canvas/side-toolbar";
// import { useRef, useEffect, useState, useContext, useCallback } from "react";
// import { Stage, Layer, Line } from "react-konva";
// import { RoomContext } from "@/lib/context/roomContext";
// import { useSocket } from "@/lib/hooks/useSocket";
// import { useDrawLine, useStartLine } from "@/components/canvas/hooks/lineHooks";
// import { v4 as uuidv4 } from "uuid";
// import { IStage } from "@/models/Stage";

export default function Board({ boardId }: { boardId: string }) {
  //   const {
  //     lines,
  //     setLines,
  //     brushColor,
  //     setBrushColor,
  //     currentLineId,
  //     setCurrentLineId,
  //   } = useContext(RoomContext);
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
        {/* <Stage
            width={window.innerWidth}
            height={window.innerHeight}
            onMouseDown={handleMouseDown}
            onTouchStart={handleMouseDown}
            onMouseMove={handleMouseMove}
            onTouchMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onTouchEnd={handleMouseUp}
          >
            <Layer>
              {Array.from(lines.entries()).map(([key, line]) => {
                return (
                  <Line
                    key={key}
                    points={line.points}
                    stroke={line.stroke}
                    strokeWidth={5}
                    bezier={true}
                    lineCap="round"
                    lineJoin="round"
                    globalCompositeOperation={
                      line.globalCompositeOperation === "eraser"
                        ? "destination-out"
                        : "source-over"
                    }
                  />
                );
              })}
            </Layer>
          </Stage> */}
      </div>
    </div>
  );
}
