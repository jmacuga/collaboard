"use client";
import SideToolbar from "./side-toolbar";
import { useCallback, useRef, useEffect, useState } from "react";
import * as fabric from "fabric";
import { Canvas } from "@/app/ui/canvas/canvas";
import { socket } from "@/app/socket";
import {
  handleSocketObjectCreated,
  handleSocketObjectMoved,
} from "@/app/lib/socket/socket";
import useWindowSize from "@/app/ui/canvas/hooks/useWindowSize";
import { v4 as uuidv4 } from "uuid";
import { setCanvasEventListeners } from "@/app/ui/canvas/helpers/setCanvasEventListeners";
export default function Room({ id }: { id: string }) {
  const canvasRef: any = useRef(null);
  const fabricRef: any = useRef(null);
  const { width, height } = useWindowSize();
  const [canvas, setCanvas] = useState(fabricRef.current);
  const [modeState, setModeState] = useState("selecting");
  const modeStateRef = useRef(modeState);
  const currentCanvasId = uuidv4();
  const currentRoomId = id;

  console.log("currentCanvasId", currentCanvasId);
  console.log("currentRoomId", currentRoomId);

  useEffect(() => {
    modeStateRef.current = modeState;
  }, [modeState]);

  const handleCanvasMouseDown = ({
    opt,
    canvas,
  }: {
    opt: fabric.TPointerEventInfo<fabric.TPointerEvent>;
  }) => {
    var evt = opt.e;
    if (modeStateRef.current === "dragging") {
      canvas.isDragging = true;
      canvas.selection = false;
      canvas.lastPosX = evt.clientX;
      canvas.lastPosY = evt.clientY;
    }
    if (canvas.isDrawingMode) {
      var brush = new fabric.PencilBrush(canvas);
      brush.color = "red";
      brush.width = 4;
      canvas.freeDrawingBrush = brush;
    }
  };

  const handleCanvasPathCreated = ({
    opt,
    socket,
  }: {
    opt: { path: fabric.Path };
    socket: any;
  }) => {
    opt.path.id = uuidv4();
    const object = opt.path.toObject(["id"]);
    console.log("object", object);
    console.log("emitting created object to server");
    socket.emit("object-created", object, currentCanvasId, currentRoomId);
  };

  const handleCanvasMouseMove = ({
    opt,
    canvas,
  }: {
    opt: fabric.TPointerEventInfo<fabric.TPointerEvent>;
  }) => {
    if (canvas.isDragging) {
      var e = opt.e;
      var vpt = canvas.viewportTransform;
      vpt[4] += e.clientX - canvas.lastPosX;
      vpt[5] += e.clientY - canvas.lastPosY;
      canvas.requestRenderAll();
      canvas.lastPosX = e.clientX;
      canvas.lastPosY = e.clientY;
    }
  };

  const handleCanvasMouseUp = ({
    canvas,
  }: {
    opt: fabric.TPointerEventInfo<fabric.TPointerEvent>;
  }) => {
    canvas.setViewportTransform(canvas.viewportTransform);
    canvas.isDragging = false;
    canvas.selection = true;
  };

  const handleCanvasObjectMoved = ({
    opt,
  }: {
    opt: fabric.ModifiedEvent<fabric.TPointerEvent>;
  }) => {
    console.log("object moved - emmiting to server");
    var object = opt.target;
    console.log("Emmiting id:", object.id);
    socket.emit(
      "object-moved",
      object.id,
      object.left,
      object.top,
      currentCanvasId,
      currentRoomId
    );
  };

  const onCanvasLoad = useCallback(
    async (initFabricCanvas: fabric.Canvas) => {
      initFabricCanvas.setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });

      console.log("Canvas load");
      fabricRef.current = initFabricCanvas;

      const canvas = fabricRef.current;

      canvas.on("path:created", (opt: { path: fabric.Path }) => {
        handleCanvasPathCreated({ opt, socket });
      });

      canvas.on(
        "mouse:down",
        (opt: fabric.TPointerEventInfo<fabric.TPointerEvent>) => {
          handleCanvasMouseDown({ opt, canvas });
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
          handleCanvasObjectMoved({ opt });
        }
      );

      socket.on("object-created", (obj, canvasId, roomId) => {
        console.log("received id:", canvasId);
        console.log("current id:", currentCanvasId);
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
