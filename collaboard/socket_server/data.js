import FabricCanvas from "./models/FabricCanvas.js";

export async function addObjectToCanvas({ object, canvasId }) {
  try {
    const canvas = await FabricCanvas.findById(canvasId);
    canvas.objects.push(object);
    canvas.save();
  } catch (e) {
    console.error(e);
  }
}
