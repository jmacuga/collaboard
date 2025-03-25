"use server";

import { prisma } from "@/db/prisma";
import {
  Board,
  Team,
  TeamMember,
  User,
  TeamInvitation,
  TeamInvitationStatus,
} from "@prisma/client";

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
      where: { teamId, archived: false },
    });
    return boards;
  } catch (e) {
    console.error(e);
    return null;
  }
}

export async function getInvitations(
  email: string
): Promise<TeamInvitation[] | null> {
  try {
    const invitations = await prisma.teamInvitation.findMany({
      where: { email, status: "PENDING" },
      include: {
        team: true,
        host: true,
      },
    });

    return invitations;
  } catch (e) {
    console.error(e);
    return null;
  }
}

export async function updateInvitationStatus(
  invitationId: string,
  status: TeamInvitationStatus
): Promise<TeamInvitation | null> {
  try {
    if (status !== "ACCEPTED" && status !== "REJECTED") {
      console.error("Invalid status");
      return null;
    }
    const invitation = await prisma.teamInvitation.update({
      where: { id: invitationId },
      data: { status },
    });
    return invitation;
  } catch (e) {
    console.error(e);
    return null;
  }
}

export async function getInvitationById(
  id: string
): Promise<TeamInvitation | null> {
  try {
    const invitation = await prisma.teamInvitation.findUnique({
      where: { id },
    });
    return invitation;
  } catch (e) {
    console.error(e);
    return null;
  }
}
