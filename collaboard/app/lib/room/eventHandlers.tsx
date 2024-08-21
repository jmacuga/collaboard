import { socket } from "@/app/socket";
import * as fabric from "fabric";
import { v4 as uuidv4 } from "uuid";

export const handleCanvasMouseDown = ({
  opt,
  canvas,
  modeStateRef,
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

export const handleCanvasPathCreated = ({
  opt,
  socket,
  currentCanvasId,
  currentRoomId,
}: {
  opt: { path: fabric.Path };
  socket: any;
  currentCanvasId: string;
  currentRoomId: string;
}) => {
  opt.path.id = uuidv4();
  const object = opt.path.toObject(["id"]);
  console.log("object", object);
  console.log("emitting created object to server");
  socket.emit("object-created", object, currentCanvasId, currentRoomId);
};

export const handleCanvasMouseMove = ({
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

export const handleCanvasMouseUp = ({
  canvas,
}: {
  opt: fabric.TPointerEventInfo<fabric.TPointerEvent>;
}) => {
  canvas.setViewportTransform(canvas.viewportTransform);
  canvas.isDragging = false;
  canvas.selection = true;
};

export const handleCanvasObjectMoved = ({
  opt,
  currentCanvasId,
  currentRoomId,
}: {
  opt: fabric.ModifiedEvent<fabric.TPointerEvent>;
  currentCanvasId: string;
  currentRoomId: string;
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
