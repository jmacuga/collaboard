import mongoose from "mongoose";

const RoomSchema = new mongoose.Schema({
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
  stageId: {
    type: String,
    required: true,
  },
});

export default mongoose.models.Room ||
  mongoose.model("Room", RoomSchema, "rooms");
