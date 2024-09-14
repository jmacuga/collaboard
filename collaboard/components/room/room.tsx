"use client";
import SideToolbar from "./side-toolbar";
import { useCallback, useRef, useEffect, useState, use } from "react";
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
} from "@/lib/room/eventHandlers";
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
  console.log("fabricCanvas", fabricCanvas);
  const canvasId = fabricCanvas._id;

  useEffect(() => {
    console.log("currentCanvasId", canvasId);
  }, []);

  useEffect(() => {
    modeStateRef.current = modeState;
    console.log("modeState", modeState);
  }, [modeState]);

  const onCanvasLoad = useCallback(
    async (initFabricCanvas: fabric.Canvas) => {
      console.log("Canvas load");
      initFabricCanvas.setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
      socket.emit("joined-room", id);
      fabricRef.current = initFabricCanvas;

      const canvas = fabricRef.current;
      canvas.id = canvasId;

      socket.emit("request-canvas", id);
      if (fabricCanvas.objects) {
        canvas
          .loadFromJSON(
            fabricCanvas.objects,
            () => {
              canvas.renderAll.bind(canvas);
            },
            (o: fabric.FabricObject, object: fabric.FabricObject) => {
              object.id = o.id;
            }
          )
          .then(function () {
            canvas.renderAll();
          });
      }

      canvas.on("path:created", (opt: { path: fabric.Path }) => {
        handleCanvasPathCreated({ opt: opt, roomId: id, canvasId: canvasId });
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

      // canvas.on(
      //   "object:modified",
      //   function (opt: fabric.ModifiedEvent<fabric.TPointerEvent>) {
      //     console.log("object moved");
      //     handleCanvasObjectMoved({ opt, socket.id, id });
      //   }
      // );

      // socket.on("object-created", (obj, srcClientId, roomId) => {
      //   if (srcClientId === socket.id) {
      //     return;
      //   }
      //   handleSocketObjectCreated(obj, canvas);
      // });

      // socket.on("object-moved", (objId, left, top, canvasId, roomId) => {
      //   console.log("object moved - received from server");
      //   if (canvasId === socket.id ) {
      //     return;
      //   }
      //   handleSocketObjectMoved(objId, left, top, canvas);
      // });
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
        canvas.isDrawingMode = true;
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
  useEffect(() => {}, [canvas]);

  return (
    <div className="flex h-screen flex-col md:flex-row md:overflow-hidden ">
      <div className="w-full flex-none md:w-32">
        <SideToolbar setCursorMode={setCursorMode} />
      </div>
      <div className="flex-grow md:overflow-y-auto">
        <Canvas onLoad={onCanvasLoad} ref={canvasRef} saveState />
      </div>
    </div>
  );
}
