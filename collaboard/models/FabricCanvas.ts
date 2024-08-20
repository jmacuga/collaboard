import mongoose from "mongoose";
import Canvas from "fabric";

export interface IFabricCanvas extends mongoose.Document {
  canvasData: typeof Canvas | null;
}

const FabricCanvasSchema = new mongoose.Schema<IFabricCanvas>({
  canvasData: mongoose.Schema.Types.Mixed,
});

export default mongoose.models.FabricCanvas ||
  mongoose.model("FabricCanvas", FabricCanvasSchema);
