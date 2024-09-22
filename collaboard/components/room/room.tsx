"use client";
import SideToolbar from "../canvas/side-toolbar";
import { useCallback, useRef, useEffect, useState } from "react";
import * as fabric from "fabric";
import { Canvas } from "@/components/canvas/canvas";
import { socket } from "@/app/socket";
import {
  handleSocketObjectCreated,
  handleSocketObjectMoved,
} from "@/lib/socket/socket";
import {
  handleCanvasMouseDown,
  handleCanvasMouseMove,
  handleCanvasMouseUp,
  handleCanvasPathCreated,
  handleCanvasObjectMoved,
  setDrawingMode,
} from "@/lib/room/canvasEventHandlers";
import { loadCanvasObjects } from "@/lib/room/utils";
import useWindowSize from "@/components/canvas/hooks/useWindowSize";
import { IFabricCanvas } from "@/models/FabricCanvas";
export default function Room({
  id,
  fabricCanvas,
}: {
  id: string;
  fabricCanvas: IFabricCanvas;
}) {
  const canvasRef: any = useRef(null);
  const fabricRef: any = useRef(null);
  const { width, height } = useWindowSize();
  const [canvas, setCanvas] = useState(fabricRef.current);
  const [modeState, setModeState] = useState("selecting");
  const modeStateRef = useRef(modeState);
  const canvasId = fabricCanvas._id as string;
  const roomId = id;

  useEffect(() => {
    modeStateRef.current = modeState;
  }, [modeState]);

  const onCanvasLoad = useCallback(
    async (initFabricCanvas: fabric.Canvas) => {
      console.log("Canvas load");
      socket.emit("joined-room", roomId);

      loadCanvasObjects(fabricCanvas.objects, initFabricCanvas);

      fabricRef.current = initFabricCanvas;

      const canvas = fabricRef.current;
      canvas.id = canvasId;

      canvas.on("path:created", (opt: { path: fabric.Path }) => {
        handleCanvasPathCreated({ opt, roomId });
      });

      canvas.on(
        "mouse:down",
        (opt: fabric.TPointerEventInfo<fabric.TPointerEvent>) => {
          handleCanvasMouseDown({
            opt,
            canvas,
            modeStateRef,
          });
        }
      );

      canvas.on(
        "mouse:move",
        (opt: fabric.TPointerEventInfo<fabric.TPointerEvent>) => {
          handleCanvasMouseMove({ opt, canvas });
        }
      );

      canvas.on(
        "mouse:up",
        function (opt: fabric.TPointerEventInfo<fabric.TPointerEvent>) {
          handleCanvasMouseUp({ canvas });
        }
      );

      canvas.on(
        "object:modified",
        function (opt: fabric.ModifiedEvent<fabric.TPointerEvent>) {
          handleCanvasObjectMoved({ opt, roomId });
        }
      );

      socket.on("object-created", (obj) => {
        handleSocketObjectCreated(obj, canvas);
      });

      socket.on("object-moved", (objId, left, top) => {
        handleSocketObjectMoved(objId, left, top, canvas);
      });
    },
    [fabricRef, socket]
  );

  useEffect(() => {
    setCanvas(fabricRef.current);
    if (canvas) {
      canvas.setDimensions({
        width: width,
        height: height,
      });
    }
  }, [width, height]);

  function setCursorMode(mode: string) {
    // Modes
    //   drawing
    //   dragging
    //   selecting
    //   addingObject
    //
    setModeState(mode);
    if (canvas) {
      if (mode === "drawing") {
        setDrawingMode(canvas);
      } else {
        canvas.isDrawingMode = false;
      }
      if (mode === "selecting") {
      }
      if (mode === "dragging") {
      }
    }
    console.log("Mode set to: ", mode);
  }

  const handleToolSelect = (tool) => {
    console.log("Tool selected: ", tool);
  };

  const changeBrushColor = (color: string) => {
    canvas.freeDrawingBrush.color = color;
  };

  return (
    <div className="flex h-screen flex-col md:flex-row md:overflow-hidden ">
      <div className="z-10 flex-shrink ">
        <SideToolbar
          setCursorMode={setCursorMode}
          changeBrushColor={changeBrushColor}
          cursorMode={modeState}
        />
      </div>
      <div className="flex-grow md:overflow-y-auto">
        <Canvas onLoad={onCanvasLoad} ref={canvasRef} saveState />
      </div>
    </div>
  );
}
