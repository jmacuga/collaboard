import mongoose from "mongoose";
import Konva from "konva";

export interface IStage extends mongoose.Document {
  data: Konva.Stage;
}

const StageSchema = new mongoose.Schema<IStage>({
  data: { type: Object, required: true },
});

export default mongoose.models.Stage ||
  mongoose.model("Stage", StageSchema, "stages");
