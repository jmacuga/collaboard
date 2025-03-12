"use server";

import { prisma } from "@/db/prisma";
import { Board, Team, User } from "@prisma/client";

export async function createBoard({
  name,
  teamId,
  isMergeRequestRequired,
  docUrl,
}: {
  name: string;
  teamId: string;
  isMergeRequestRequired?: boolean;
  docUrl?: string;
}): Promise<Board | null> {
  try {
    const board = await prisma.board.create({
      data: {
        name,
        teamId,
        isMergeRequestRequired: isMergeRequestRequired ?? true,
        docUrl,
      },
    });
    return board;
  } catch (e) {
    console.error(e);
    return null;
  }
}

export async function deleteBoard(boardId: string): Promise<Board | null> {
  try {
    const board = await prisma.board.delete({
      where: { id: boardId },
    });
    return board;
  } catch (e) {
    console.error(e);
    return null;
  }
}

export async function getBoardById(id: string): Promise<Board | null> {
  try {
    if (!id) {
      console.error("Board ID is required");
      return null;
    }
    const board = await prisma.board.findUnique({
      where: { id },
    });
    return board;
  } catch (e) {
    console.error(e);
    return null;
  }
}

export async function getUser(email: string): Promise<User | null> {
  try {
    return await prisma.user.findUnique({
      where: { email },
    });
  } catch (error) {
    console.error("Failed to fetch user:", error);
    return null;
  }
}

export async function getUserTeams(userId: string): Promise<Team[] | null> {
  try {
    const teams = await prisma.team.findMany({
      where: {
        members: {
          some: {
            userId,
          },
        },
      },
    });
    return teams;
  } catch (e) {
    console.error(e);
    return null;
  }
}

export async function getTeamBoards(teamId: string): Promise<Board[] | null> {
  try {
    const boards = await prisma.board.findMany({
      where: { teamId },
    });
    return boards;
  } catch (e) {
    console.error(e);
    return null;
  }
}

export async function getTeam(id: string): Promise<Team | null> {
  try {
    const team = await prisma.team.findUnique({
      where: { id },
    });
    return team;
  } catch (e) {
    console.error(e);
    return null;
  }
}

export async function updateBoard(
  boardId: string,
  updateData: Partial<Board>
): Promise<Board | null> {
  if (!boardId) {
    console.error("Board ID is required");
    return null;
  }
  try {
    return await prisma.board.update({
      where: { id: boardId },
      data: updateData,
    });
  } catch (e) {
    console.error(e);
    return null;
  }
}

export async function getBoardDocUrl(boardId: string): Promise<string | null> {
  try {
    const board = await prisma.board.findUnique({
      where: { id: boardId },
      select: { docUrl: true },
    });
    return board?.docUrl || null;
  } catch (e) {
    console.error(e);
    return null;
  }
}
