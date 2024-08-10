"use client";

import { useCallback, useRef, useEffect } from "react";
import * as fabric from "fabric";
import { Canvas } from "@/app/ui/canvas/canvas";
import {
  handleCanvasMouseDown,
  handleCanvasPathCreated,
} from "@/lib/canvas/canvas";
import { socket } from "../socket";
import { handleSocketObjectCreated } from "@/lib/socket/socket";
import useWindowSize from "../ui/canvas/hooks/useWindowSize";

export default function CanvasPage() {
  const canvasRef: any = useRef(null);
  const fabricRef: any = useRef(null);
  const { width, height } = useWindowSize();

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

      socket.on("object-created", (data) => {
        const canvas = fabricRef.current;
        handleSocketObjectCreated(data, canvas);
      });
    },
    [fabricRef, socket]
  );

  useEffect(() => {
    const canvas = fabricRef.current;
    if (canvas) {
      canvas.setDimensions({
        width: width,
        height: height,
      });
    }
  }, [width, height]);

  return (
    <div>
      <Canvas onLoad={onCanvasLoad} ref={canvasRef} saveState />
    </div>
  );
}
