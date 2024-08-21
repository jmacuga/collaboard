"use client";
import SideToolbar from "./side-toolbar";
import { useCallback, useRef, useEffect, useState, use } from "react";
import * as fabric from "fabric";
import { Canvas } from "@/app/ui/canvas/canvas";
import { socket } from "@/app/socket";
import {
  handleSocketObjectCreated,
  handleSocketObjectMoved,
} from "@/app/lib/socket/socket";
import {
  handleCanvasMouseDown,
  handleCanvasMouseMove,
  handleCanvasMouseUp,
  handleCanvasPathCreated,
  handleCanvasObjectMoved,
} from "@/app/lib/room/eventHandlers";
import useWindowSize from "@/app/ui/canvas/hooks/useWindowSize";
import { v4 as uuidv4 } from "uuid";
export default function Room({ id }: { id: string }) {
  const canvasRef: any = useRef(null);
  const fabricRef: any = useRef(null);
  const { width, height } = useWindowSize();
  const [canvas, setCanvas] = useState(fabricRef.current);
  const [modeState, setModeState] = useState("selecting");
  const modeStateRef = useRef(modeState);
  const [currentCanvasId, setCurrentCanvasId] = useState(uuidv4());
  const currentRoomId = id;

  useEffect(() => {
    console.log("currentCanvasId", currentCanvasId);
    console.log("currentRoomId", currentRoomId);
  }, []);

  useEffect(() => {
    modeStateRef.current = modeState;
    console.log("modeState", modeState);
  }, [modeState]);

  const onCanvasLoad = useCallback(
    async (initFabricCanvas: fabric.Canvas) => {
      initFabricCanvas.setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });

      socket.emit("joined-room", currentRoomId);

      console.log("Canvas load");
      fabricRef.current = initFabricCanvas;

      const canvas = fabricRef.current;

      socket.emit("request-canvas", currentRoomId, currentCanvasId);

      socket.on("request-canvas", (roomId, dstCanvasId) => {
        if (roomId !== currentRoomId || dstCanvasId === currentCanvasId) {
          return;
        }
        console.log("canvas", canvas);
        console.log("Sending canvas to server");
        const canvasData = canvas.toObject(["id"]);
        socket.emit("response-canvas", canvasData, roomId, dstCanvasId);
      });

      socket.on("response-canvas", (canvasData, roomId, dstCanvasId) => {
        if (currentCanvasId !== dstCanvasId || roomId !== currentRoomId) {
          return;
        }
        canvas
          .loadFromJSON(
            canvasData,
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
      });

      canvas.on("path:created", (opt: { path: fabric.Path }) => {
        handleCanvasPathCreated({
          opt,
          currentCanvasId,
          currentRoomId,
        });
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
          console.log("object moved");
          handleCanvasObjectMoved({ opt, currentCanvasId, currentRoomId });
        }
      );

      socket.on("object-created", (obj, canvasId, roomId) => {
        if (canvasId === currentCanvasId || roomId !== currentRoomId) {
          return;
        }
        handleSocketObjectCreated(obj, canvas);
      });

      socket.on("object-moved", (objId, left, top, canvasId, roomId) => {
        console.log("object moved - received from server");
        if (canvasId === currentCanvasId || roomId !== currentRoomId) {
          return;
        }
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
