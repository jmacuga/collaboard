import mongoose, { ObjectId } from "mongoose";

export interface IComment extends mongoose.Document {
  boardId: ObjectId;
  userId: ObjectId;
  text: string;
  objectId: string;
}

const CommentSchema = new mongoose.Schema(
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
    text: { type: String, required: true },
    objectId: { type: String, required: true },
  },
  { timestamps: true }
);

export const Comment =
  mongoose.models.Comment ||
  mongoose.model<IComment>("Comment", CommentSchema, "comments");
