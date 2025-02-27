import mongoose from "mongoose";

export interface IDoc extends mongoose.Document {
  _id: string;
  key: [];
  data: BinaryType;
}

const DocSchema = new mongoose.Schema({
  key: { type: String, required: true },
  doc: { type: Object, required: true },
});

export const Doc =
  mongoose.models?.Doc || mongoose.model<IDoc>("Doc", DocSchema, "docs");
