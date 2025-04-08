import mongoose from "mongoose";

export interface IDoc extends mongoose.Document {
  _id: string;
  key: string[];
  data: Buffer;
  updatedAt: Date;
}

const DocSchema = new mongoose.Schema({
  key: { type: [String], required: true },
  data: { type: Buffer, required: true },
  updatedAt: { type: Date, default: Date.now },
});

export const Doc =
  mongoose.models?.Doc || mongoose.model<IDoc>("Doc", DocSchema, "docs");
