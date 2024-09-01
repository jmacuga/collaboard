import mongoose from "mongoose";

export interface IRoom extends mongoose.Document {
  name: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  users: [string];
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
  canvasId: {
    type: String,
    required: true,
  },
});

export default mongoose.models.Room ||
  mongoose.model<IRoom>("Room", RoomSchema, "rooms");
