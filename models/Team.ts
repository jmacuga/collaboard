import mongoose from "mongoose";

export interface ITeam extends mongoose.Document {
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

const TeamSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
  },
  { timestamps: true }
);

export const Team =
  mongoose.models.Team || mongoose.model<ITeam>("Team", TeamSchema, "teams");
