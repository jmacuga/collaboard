import mongoose, { ObjectId } from "mongoose";

export interface IBoard extends mongoose.Document {
  name: string;
  teamId: ObjectId;
  isMergeRequestRequired: boolean;
  docUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const BoardSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    teamId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Team",
    },
    isMergeRequestRequired: { type: Boolean, required: true, default: true },
    docUrl: { type: String },
  },
  { timestamps: true }
);

export const Board =
  mongoose.models.Board ||
  mongoose.model<IBoard>("Board", BoardSchema, "boards");
