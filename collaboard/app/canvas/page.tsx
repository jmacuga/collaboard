"use client";

import { useCallback, useRef } from "react";
import * as fabric from "fabric";
import { Canvas } from "@/app/ui/board/canvas";
import {
  handleCanvasMouseDown,
  handleCanvasPathCreated,
} from "@/lib/board/board";
import { socket } from "../socket";
import { handleSocketObjectCreated } from "@/lib/socket/socket";

export default function CanvasPage() {
  const canvasRef: any = useRef(null);
  const fabricRef: any = useRef(null);

  const onCanvasLoad = useCallback(
    async (initFabricCanvas: fabric.Canvas) => {
      initFabricCanvas.setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });

      initFabricCanvas.on("path:created", (options) => {
        handleCanvasPathCreated({ options, socket });
      });

      initFabricCanvas.on("mouse:down", (options) => {
        const canvas = fabricRef.current;
        handleCanvasMouseDown({ options, canvas });
      });

      console.log("Canvas load");
      fabricRef.current = initFabricCanvas;
    },
    [fabricRef, handleCanvasMouseDown, handleCanvasPathCreated]
  );

  socket.on("object-created", (data) => {
    handleSocketObjectCreated({ data, canvas: fabricRef });
  });

  return (
    <div>
      <Canvas onLoad={onCanvasLoad} ref={canvasRef} saveState />
    </div>
  );
}
