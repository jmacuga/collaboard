import mongoose, { ObjectId } from "mongoose";
import MergeRequestStatus from "@/types/MergeRequestStatus";

export interface IMergeRequest extends mongoose.Document {
  _id: string;
  boardId: ObjectId;
  requester: ObjectId;
  updateData: Object;
  status: MergeRequestStatus;
}

const MergeRequestSchema = new mongoose.Schema(
  {
    boardId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Board",
    },
    requester: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    updateData: { type: Object, required: true },
    status: {
      type: String,
      enum: Object.values(MergeRequestStatus),
      required: true,
    },
  },
  { timestamps: true }
);

export const MergeRequest =
  mongoose.models?.MergeRequest ||
  mongoose.model<IMergeRequest>(
    "MergeRequest",
    MergeRequestSchema,
    "merge_requests"
  );
