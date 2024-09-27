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
import { Stage, Layer, Text, Star, Line } from "react-konva";
import { RoomContext } from "@/lib/context/roomContext";
import { useSocket } from "@/lib/hooks/useSocket";
import {
  useCreateLine,
  useStartLine,
} from "@/components/canvas/hooks/lineHooks";
export default function Room({ roomId }: { roomId: string }) {
  const { nodes, setNodes, setSelectedNode } = useContext(RoomContext);
  const { joinRoom, leaveRoom } = useSocket({ roomId });

  const [mode, setMode] = useState("selecting");
  const modeStateRef = useRef(mode);
  const [tool, setTool] = useState("pen");
  const [lines, setLines] = useState([]);
  const isDrawing = useRef(false);

  useEffect(() => {
    modeStateRef.current = mode;
    joinRoom();
  }, [mode]);

  function setCursorMode(new_mode: string) {
    setMode(new_mode);
    console.log("Mode set to: ", mode);
  }

  const changeBrushColor = (color: string) => {};

  const handleMouseDown = (e) => {
    if (mode == "drawing") {
      isDrawing.current = true;
    }
    useStartLine({ e, lines, setLines, tool });
  };

  const handleMouseMove = (e) => {
    if (mode == "drawing") {
      if (!isDrawing.current) {
        return;
      }
      const lastLine = useCreateLine({ e, lines, setLines });
    }
  };

  const handleMouseUp = useCallback(() => {
    if (mode == "drawing") {
      isDrawing.current = false;
    }
  }, [mode]);

  return (
    <div className="flex h-screen flex-col md:flex-row md:overflow-hidden ">
      <div className="z-10 flex-shrink ">
        <SideToolbar
          setCursorMode={setCursorMode}
          changeBrushColor={changeBrushColor}
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
            {lines.map((line, i) => (
              <Line
                key={i}
                points={line.points}
                stroke="#df4b26"
                strokeWidth={5}
                bezier={true}
                lineCap="round"
                lineJoin="round"
                globalCompositeOperation={
                  line.tool === "eraser" ? "destination-out" : "source-over"
                }
              />
            ))}
          </Layer>
        </Stage>
      </div>
    </div>
  );
}
