import { FabricObject } from "fabric";
import mongoose from "mongoose";

export interface IFabricCanvas extends mongoose.Document {
  objects: [FabricObject];
  layers: {
    name: string;
    objects: [string];
  };
}

const FabricCanvasSchema = new mongoose.Schema<IFabricCanvas>({
  objects: {
    type: [Object],
    required: true,
  },
  layers: {
    name: String,
    objects: [String],
  },
});

export default mongoose.models.FabricCanvas ||
  mongoose.model("FabricCanvas", FabricCanvasSchema, "fabric_canvases");
