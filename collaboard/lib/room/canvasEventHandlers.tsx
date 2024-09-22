import { socket } from "@/app/socket";
import * as fabric from "fabric";
import { MutableRefObject } from "react";
import { v4 as uuidv4 } from "uuid";

export const handleCanvasMouseDown = ({
  opt,
  canvas,
  modeStateRef,
}: {
  opt: fabric.TPointerEventInfo<fabric.TPointerEvent>;
  canvas: any;
  modeStateRef: MutableRefObject<string>;
}) => {
  var evt = opt.e;
  console.log("modeState", modeStateRef);
  if (modeStateRef.current === "dragging") {
    canvas.isDragging = true;
    canvas.selection = false;
    canvas.lastPosX = evt.clientX;
    canvas.lastPosY = evt.clientY;
  }
};

export const handleCanvasPathCreated = ({
  opt,
  roomId,
}: {
  opt: { path: fabric.Path };
  roomId: string;
}) => {
  opt.path.id = uuidv4();
  const object = opt.path.toObject(["id"]);
  socket.emit("object-created", object, roomId);
};

export const handleCanvasMouseMove = ({
  opt,
  canvas,
}: {
  opt: fabric.TPointerEventInfo<fabric.TPointerEvent>;
  canvas: any;
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

export const handleCanvasMouseUp = ({ canvas }) => {
  canvas.setViewportTransform(canvas.viewportTransform);
  canvas.isDragging = false;
  canvas.selection = true;
};

export const handleCanvasObjectMoved = ({
  opt,
  roomId,
}: {
  opt: fabric.ModifiedEvent<fabric.TPointerEvent>;
  roomId: string;
}) => {
  var object = opt.target;
  socket.emit("object-moved", object.id, object.left, object.top, roomId);
};

export const setDrawingMode = (canvas: fabric.Canvas) => {
  if (canvas.isDrawingMode) {
    return;
  }
  canvas.isDrawingMode = true;
  var brush = new fabric.PencilBrush(canvas);
  brush.color = "red";
  brush.width = 4;
  canvas.freeDrawingBrush = brush;
};
