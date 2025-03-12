import mongoose from "mongoose";

export interface IChange extends mongoose.Document {
  _id: string;
  data: BinaryType;
}

const ChangeSchema = new mongoose.Schema({
  data: { type: Object, required: true },
});

export const Change =
  mongoose.models?.Change ||
  mongoose.model<IChange>("Change", ChangeSchema, "changes");
