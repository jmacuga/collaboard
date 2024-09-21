import * as fabric from "fabric";

export function loadCanvasObjects(objects: any[], canvas: fabric.Canvas) {
  if (objects) {
    fabric.util
      .enlivenObjects(objects)
      .then((objects) => {
        objects.forEach((o) => {
          canvas.add(o);
        });
        canvas.renderAll();
      })
      .catch((err) => {
        console.error("Error enliving objects", err);
      });
  }
}
