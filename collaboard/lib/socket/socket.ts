import * as fabric from "fabric";
import FabricHelper from "../room/FabricHelper";

export const handleSocketObjectCreated = (
  object: fabric.FabricObject,
  canvas: fabric.Canvas
) => {
  if (object.type === "Path") {
    const fabricObj = fabric.Path.fromObject(object).then((fabricObj) => {
      fabricObj.id = object.id;
      canvas.add(fabricObj);
    });
  }
};

import { FabricObject } from "fabric";

export const handleSocketObjectMoved = (
  objId: string,
  left: number,
  top: number,
  canvas: fabric.Canvas
) => {
  console.log("Moved Received id", objId);
  const object: FabricObject | null = new FabricHelper(canvas).findObjectById(
    objId
  );
  console.log("Object found", object);
  if (object) {
    object.set({
      left: left,
      top: top,
    });
    object.setCoords();
    canvas.renderAll();
  }
};
