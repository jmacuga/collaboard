import mongoose, { ObjectId, Schema } from "mongoose";
import TeamInvitationStatus from "@/types/TeamInvitationStatus";

export interface ITeamInvitation extends mongoose.Document {
  status: TeamInvitationStatus;
  teamId: string;
  host: ObjectId;
  invitee: ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const TeamInvitationSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      enum: Object.values(TeamInvitationStatus),
      required: true,
    },
    teamId: { type: Schema.Types.ObjectId, required: true, ref: "Team" },
    host: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    invitee: { type: Schema.Types.ObjectId, required: true, ref: "User" },
  },
  { timestamps: true }
);

export const TeamInvitation =
  mongoose.models.TeamInvitation ||
  mongoose.model<ITeamInvitation>(
    "TeamInvitation",
    TeamInvitationSchema,
    "team_invitations"
  );
