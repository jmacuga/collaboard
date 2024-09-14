import mongoose from "mongoose";

const FabricCanvasSchema = new mongoose.Schema({
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
