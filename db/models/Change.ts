import mongoose from "mongoose";

export interface IChange extends mongoose.Document {
  _id: string;
  data: Buffer[];
}

const ChangeSchema = new mongoose.Schema({
  data: { type: [Buffer], required: true },
});

export const Change =
  mongoose.models?.Change ||
  mongoose.model<IChange>("Change", ChangeSchema, "changes");
