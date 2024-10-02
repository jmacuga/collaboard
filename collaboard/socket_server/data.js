import Stage from "./models/Stage.js";
import Room from "./models/Room.js";

export async function addObjectToStage({ object, roomId }) {
  try {
    const room = await Room.findById(roomId);
    if (!room) {
      throw new Error(`Room with id ${roomId} not found`);
    }

    const stage = await Stage.findById(room.stageId);
    if (!stage) {
      throw new Error(`CanvaStage canvas with id ${room.stageId} not found`);
    }
    if (!object) {
      return { success: false, message: "Object is required" };
    }
    stage.objects.push(object);
    await stage.save();

    return { success: true, message: "Object added to canvas successfully" };
  } catch (e) {
    console.error(e);
  }
}
