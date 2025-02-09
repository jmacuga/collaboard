import mongoose, { ObjectId } from "mongoose";
import BoardAction from "@/types/BoardAction";

export interface IBoardLog extends mongoose.Document {
  boardId: ObjectId;
  userId: ObjectId;
  action: BoardAction;
  objectId: String;
  headId: String;
  createdAt: Date;
  updatedAt: Date;
}

const BoardLogSchema = new mongoose.Schema(
  {
    boardId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Board",
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    action: { type: String, enum: Object.values(BoardAction), required: true },
    objectId: { type: String },
    headId: { type: String },
  },
  { timestamps: true }
);

export const BoardLog =
  mongoose.models.BoardLog ||
  mongoose.model<IBoardLog>("BoardLog", BoardLogSchema, "board_logs");
