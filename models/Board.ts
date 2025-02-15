"use server";
import mongoose, { ObjectId } from "mongoose";
import { Schema, model, models } from "mongoose";
export interface IBoard extends mongoose.Document {
  id: string;
  name: string;
  teamId: ObjectId;
  isMergeRequestRequired: boolean;
  docUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const boardSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    teamId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Team",
    },
    isMergeRequestRequired: { type: Boolean, required: true, default: true },
    docUrl: { type: String },
  },
  {
    timestamps: true,
  }
);

export const Board = models?.Board || model("Board", boardSchema);
