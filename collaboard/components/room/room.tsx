"use client";
import SideToolbar from "@/components/canvas/side-toolbar";
import {
  useRef,
  useEffect,
  useState,
  useContext,
  useCallback,
  use,
} from "react";
import { Stage, Layer, Text, Star, Line, Shape } from "react-konva";
import { RoomContext } from "@/lib/context/roomContext";
import { useSocket } from "@/lib/hooks/useSocket";
import {
  useCreateLine,
  useStartLine,
} from "@/components/canvas/hooks/lineHooks";
import { v4 as uuidv4 } from "uuid";

export default function Room({ roomId }: { roomId: string }) {
  const { lines, setLines, brushColor, setBrushColor } =
    useContext(RoomContext);
  const { joinRoom, leaveRoom, addShape } = useSocket({ roomId });
  const [mode, setMode] = useState("selecting");
  const modeStateRef = useRef(mode);
  const [tool, setTool] = useState("pen");
  const isDrawing = useRef(false);
  const [currentLineId, setCurrentLineId] = useState<string>("");

  useEffect(() => {
    modeStateRef.current = mode;
    joinRoom();
  }, [mode]);

  function setCursorMode(new_mode: string) {
    setMode(new_mode);
  }

  const handleMouseDown = (e) => {
    if (mode == "drawing") {
      isDrawing.current = true;
      const currentId = uuidv4();
      useStartLine({
        e,
        lines,
        setLines,
        tool,
        brushColor,
        currentLineId: currentId,
      });
      setCurrentLineId(currentId);
    }
  };

  const handleMouseMove = (e) => {
    if (mode == "drawing") {
      if (!isDrawing.current) {
        return;
      }
      useCreateLine({ e, lines, setLines, currentLineId });
    }
  };

  const handleMouseUp = useCallback(() => {
    if (mode == "drawing") {
      isDrawing.current = false;
      addShape({ shape: lines.get(currentLineId) });
    }
  }, [mode, lines]);

  return (
    <div className="flex h-screen flex-col md:flex-row md:overflow-hidden ">
      <div className="z-10 flex-shrink ">
        <SideToolbar
          setCursorMode={setCursorMode}
          changeBrushColor={setBrushColor}
          cursorMode={mode}
        />
      </div>
      <div className="flex-grow md:overflow-y-auto">
        <Stage
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
        </Stage>
      </div>
    </div>
  );
}
