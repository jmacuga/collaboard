import mongoose from "mongoose";
import { Canvas } from "fabric";

export interface IRoom extends mongoose.Document {
  name: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  users: [string];
  canvas: Canvas | null;
  canvasId: string;
}

export const RoomSchema = new mongoose.Schema<IRoom>({
  name: {
    type: String,
  },
  createdBy: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    required: true,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
    required: true,
  },
  users: {
    type: [String],
    default: [],
  },
  canvas: {
    type: Object,
  },
});

export default mongoose.models.Room ||
  mongoose.model<IRoom>("Room", RoomSchema);
