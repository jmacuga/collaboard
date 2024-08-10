"use client";
import SideToolbar from "./SideToolbar";
import { useCallback, useRef, useEffect, useState } from "react";
import * as fabric from "fabric";
import { Canvas } from "@/app/ui/canvas/canvas";
import { socket } from "@/app/socket";
import {
  handleSocketObjectCreated,
  handleSocketObjectMoved,
} from "@/lib/socket/socket";
import useWindowSize from "@/app/ui/canvas/hooks/useWindowSize";
import { v4 as uuidv4 } from "uuid";

// fabric.FabricObject.prototype.toObject = (function (toObject) {
//   return function (this: FabricObject) {

//   };
// })(fabric.FabricObject.prototype.toObject);

export default function Room() {
  const canvasRef: any = useRef(null);
  const fabricRef: any = useRef(null);
  const { width, height } = useWindowSize();
  const [canvas, setCanvas] = useState(fabricRef.current);
  const [modeState, setModeState] = useState("selecting");
  const modeStateRef = useRef(modeState);
  const [canvasId] = useState(uuidv4());

  useEffect(() => {
    modeStateRef.current = modeState;
  }, [modeState]);

  const handleCanvasMouseDown = ({ options, canvas }) => {
    console.log("modeStrate", modeStateRef.current);
    var evt = options.e;
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

  const handleCanvasPathCreated = ({ options, socket }) => {
    options.path.id = uuidv4();
    const object = options.path.toObject(["id"]);
    console.log("object", object);
    console.log("emitting created object to server");
    socket.emit("object-created", object, canvasId);
  };

  const handleCanvasMouseMove = ({ options, canvas }) => {
    if (canvas.isDragging) {
      var e = options.e;
      var vpt = canvas.viewportTransform;
      vpt[4] += e.clientX - canvas.lastPosX;
      vpt[5] += e.clientY - canvas.lastPosY;
      canvas.requestRenderAll();
      canvas.lastPosX = e.clientX;
      canvas.lastPosY = e.clientY;
    }
  };

  const handleCanvasMouseUp = ({ options, canvas }) => {
    canvas.setViewportTransform(canvas.viewportTransform);
    canvas.isDragging = false;
    canvas.selection = true;
  };

  const handleCanvasObjectMoved = ({ options, canvas }) => {
    console.log("object moved - emmiting to server");
    var object = options.target;
    console.log("Emmiting id:", object.id);
    socket.emit("object-moved", object.id, object.left, object.top, canvasId);
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

      canvas.on("path:created", (options) => {
        handleCanvasPathCreated({ options, socket });
      });

      canvas.on("mouse:down", (options) => {
        handleCanvasMouseDown({ options, canvas });
      });

      canvas.on("mouse:move", (options) => {
        handleCanvasMouseMove({ options, canvas });
      });

      canvas.on("mouse:up", function (options) {
        handleCanvasMouseUp({ options, canvas });
      });

      socket.on("object-created", (object, id) => {
        handleSocketObjectCreated(object, id, canvas, canvasId);
      });

      canvas.on("object:modified", function (options) {
        console.log("object moved");
        handleCanvasObjectMoved({ options, canvas });
      });

      socket.on("object-moved", (objId, left, top, id) => {
        console.log("object moved - received from server");
        handleSocketObjectMoved(objId, left, top, id, canvas, canvasId);
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
