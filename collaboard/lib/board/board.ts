import * as fabric from "fabric";

export const handleCanvasMouseDown = ({ options, canvas }) => {
  const pointer = canvas.getPointer(options.e);
  const target = canvas.findTarget(options.e, false);

  canvas.isDrawingMode = true;
  canvas.isDrawingMode = true;
  var brush = new fabric.PencilBrush(canvas);
  brush.color = "red";
  brush.width = 4;
  canvas.freeDrawingBrush = brush;
};

export const handleCanvasPathCreated = ({ options, socket }) => {
  const objectJSON = JSON.stringify(options.path.toJSON());
  console.log("emitting created object to server");
  socket.emit("object-created", objectJSON);
};
