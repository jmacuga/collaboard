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
    if (!id) {
      console.error("Board ID is required");
      return null;
    }
    await dbConnect();
    const board = await Board.findById(id);
    return JSON.parse(JSON.stringify(board));
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
    const teams = await Team.find({ _id: { $in: teamIds } });
    return JSON.parse(JSON.stringify(teams));
  } catch (e) {
    console.error(e);
    return null;
  }
}

export async function getTeamBoards(teamId: string): Promise<IBoard[] | null> {
  try {
    await dbConnect();
    const boards = await Board.find({ teamId });
    return JSON.parse(JSON.stringify(boards));
  } catch (e) {
    console.error(e);
    return null;
  }
}

export async function getTeam(id: string): Promise<ITeam | null> {
  try {
    await dbConnect();
    const team = await Team.findById(id);
    return JSON.parse(JSON.stringify(team));
  } catch (e) {
    console.error(e);
    return null;
  }
}

export async function updateBoard(
  boardId: string,
  updateData: Partial<IBoard>
) {
  if (!boardId) {
    console.error("Board ID is required");
    return null;
  }
  try {
    await dbConnect();
    return await Board.findByIdAndUpdate(boardId, updateData);
  } catch (e) {
    console.error(e);
    return null;
  }
}

export async function deleteBoard(boardId: string) {
  try {
    await dbConnect();
    return await Board.findByIdAndDelete(boardId);
  } catch (e) {
    console.error(e);
    return null;
  }
}

export async function getBoardDocUrl(boardId: string): Promise<string | null> {
  try {
    await dbConnect();
    const board = await Board.findById(boardId);
    return board?.docUrl || null;
  } catch (e) {
    console.error(e);
    return null;
  }
}
