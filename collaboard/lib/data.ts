"use server";

import { Board, IBoard } from "@/models/Board";
import dbConnect from "@/lib/dbConnect";
import { ObjectId } from "mongoose";
import { IUser, User } from "@/models/User";
import { ITeam, Team } from "@/models/Team";
import { TeamMember } from "@/models/TeamMember";
import { IDoc, Doc } from "@/models/Doc";

export async function createTeam({
  name,
  teamId,
  isMergeRequestRequired,
  docId,
}: {
  name: string;
  teamId: ObjectId;
  isMergeRequestRequired?: boolean;
  docId?: string;
}): Promise<IBoard | null> {
  try {
    await dbConnect();
    const board = await Board.create({
      name,
      teamId,
      isMergeRequestRequired,
      docId,
    });
    return board;
  } catch (e) {
    console.error(e);
    return null;
  }
}

export async function getBoardById(id: string): Promise<IBoard | null> {
  try {
    await dbConnect();
    return await Board.findById(id);
  } catch (e) {
    console.error(e);
    return null;
  }
}

export async function getUser(email: string): Promise<IUser | null> {
  try {
    await dbConnect();
    return await User.findOne({ email: email });
  } catch (error) {
    console.error("Failed to fetch user:", error);
    return null;
  }
}

export async function getUserTeams(userId: string): Promise<ITeam[] | null> {
  try {
    await dbConnect();
    const userTeamMemberships = await TeamMember.find({ userId });
    const teamIds = userTeamMemberships.map((membership) => membership.teamId);
    return await Team.find({ _id: { $in: teamIds } });
  } catch (e) {
    console.error(e);
    return null;
  }
}

export async function getTeamBoards(teamId: string): Promise<IBoard[] | null> {
  try {
    await dbConnect();
    return await Board.find({ teamId });
  } catch (e) {
    console.error(e);
    return null;
  }
}
