import mongoose from "mongoose";

export interface ITeamRole extends mongoose.Document {
  _id: string;
  name: string;
}

const TeamRoleSchema = new mongoose.Schema({
  name: { type: String, required: true },
});

export const TeamRole =
  mongoose.models?.TeamRole ||
  mongoose.model<ITeamRole>("TeamRole", TeamRoleSchema, "team_roles");
