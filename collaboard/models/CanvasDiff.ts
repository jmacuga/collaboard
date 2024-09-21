import { FabricObject } from "fabric";
import mongoose from "mongoose";

export interface ICanvasDiff extends mongoose.Document {
  diff: Object;
  revisionNumber: number;
  canvasId: string;
  TimeStamp: Date;
}

const CanvasDiffSchema = new mongoose.Schema<ICanvasDiff>({
  diff: {
    type: Object,
    required: true,
  },
  revisionNumber: {
    type: Number,
    required: true,
  },
  canvasId: { type: String, required: true },
  TimeStamp: { type: Date, default: Date.now, required: true },
});

export default mongoose.models.CanvasDiff ||
  mongoose.model("CanvasDiff", CanvasDiffSchema, "canvas_diffs");
