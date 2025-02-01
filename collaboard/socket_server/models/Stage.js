import mongoose from "mongoose";

const StageSchema = new mongoose.Schema({
  objects: {
    type: [Object],
    required: true,
  },
  layers: {
    name: String,
    objects: [String],
  },
});

export default mongoose.models.Stage ||
  mongoose.model("Stage", StageSchema, "canvas_stages");
