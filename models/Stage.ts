import mongoose from "mongoose";
import Konva from "konva";

export interface IStage extends mongoose.Document {
  _id: string;
  data: Konva.Stage;
}

const StageSchema = new mongoose.Schema<IStage>({
  data: { type: Object, required: true },
});

export default mongoose.models?.Stage ||
  mongoose.model("Stage", StageSchema, "stages");
