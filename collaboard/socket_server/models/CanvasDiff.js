import mongoose from "mongoose";

const CanvasDiffSchema = new mongoose.Schema({
  diff: {
    type: Object,
    required: true,
  },
  revisionNumber: {
    type: Number,
    required: true,
  },
  stageId: {
    type: String,
    required: true,
  },
  TimeStamp: {
    type: Date,
    default: Date.now,
    required: true,
  },
});

export default mongoose.models.CanvasDiff ||
  mongoose.model("CanvasDiff", CanvasDiffSchema, "canvas_diffs");
