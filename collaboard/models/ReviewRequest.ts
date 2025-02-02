import mongoose, { ObjectId } from "mongoose";

export interface IReviewRequest extends mongoose.Document {
  boardId: ObjectId;
  reviewer: ObjectId;
  accepted: Boolean;
  mergeRequestId: ObjectId;
}

const ReviewRequestSchema = new mongoose.Schema({
  boardId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Board",
  },
  reviewer: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  accepted: { type: Boolean, required: true, default: false },
  mergeRequestId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "MergeRequest",
  },
});

export const ReviewRequest =
  mongoose.models.ReviewRequest ||
  mongoose.model<IReviewRequest>(
    "ReviewRequest",
    ReviewRequestSchema,
    "review_requests"
  );
