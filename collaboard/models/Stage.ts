import mongoose from "mongoose";

export interface IStage extends mongoose.Document {
  objects: [];
  layers: {
    name: string;
    objects: [string];
  };
}

const StageSchema = new mongoose.Schema<IStage>({
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
