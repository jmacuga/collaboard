import mongoose, { ObjectId } from "mongoose";

export interface ITeamMember extends mongoose.Document {
  teamId: ObjectId;
  userId: ObjectId;
  role: ObjectId;
}

const TeamMemberSchema = new mongoose.Schema({
  teamId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Team" },
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
  role: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "TeamRole",
  },
});

export const TeamMember =
  mongoose.models.TeamMember ||
  mongoose.model<ITeamMember>("TeamMember", TeamMemberSchema, "team_members");
