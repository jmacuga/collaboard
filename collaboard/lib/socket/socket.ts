import * as fabric from "fabric";

export function handleSocketObjectCreated({ data, canvas }) {
  const object = JSON.parse(data);
  if (object.type === "Path") {
    fabric.Path.fromObject(object).then((objectInstance) => {
      console.log("adding object to canvas");
      canvas.current.add(objectInstance);
      canvas.current.renderAll();
    });
  }
}
