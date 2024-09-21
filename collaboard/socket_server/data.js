import FabricCanvas from "./models/FabricCanvas.js";
import Room from "./models/Room.js";

export async function addObjectToCanvas({ object, roomId }) {
  try {
    const room = await Room.findById(roomId);
    if (!room) {
      throw new Error(`Room with id ${roomId} not found`);
    }

    const canvas = await FabricCanvas.findById(room.canvasId);
    if (!canvas) {
      throw new Error(`Canvas with id ${room.canvasId} not found`);
    }

    canvas.objects.push(object);
    await canvas.save();

    return { success: true, message: "Object added to canvas successfully" };
  } catch (e) {
    console.error(e);
  }
}
