import prisma from "@/db/prisma";
import { getUser } from "@/db/data";
import { sendInvitationEmail } from "@/lib/utils/mail";
import {
  Team as PrismaTeam,
  TeamInvitation as PrismaTeamInvitation,
  TeamMember as PrismaTeamMember,
  TeamInvitationStatus,
} from "@prisma/client";

export class TeamServiceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "TeamServiceError";
  }
}

export class TeamNotFoundError extends TeamServiceError {
  constructor(teamId: string) {
    super(`Team with ID ${teamId} not found`);
    this.name = "TeamNotFoundError";
  }
}

export class UserAlreadyTeamMemberError extends TeamServiceError {
  constructor(userId: string, teamId: string) {
    super(`User ${userId} is already a member of team ${teamId}`);
    this.name = "UserAlreadyTeamMemberError";
  }
}

export class InvitationNotFoundError extends TeamServiceError {
  constructor(invitationId: string) {
    super(`Invitation with ID ${invitationId} not found`);
    this.name = "InvitationNotFoundError";
  }
}

export class InvitationNotPendingError extends TeamServiceError {
  constructor(invitationId: string) {
    super(`Invitation with ID ${invitationId} is not in pending status`);
    this.name = "InvitationNotPendingError";
  }
}

export class UserNotFoundError extends TeamServiceError {
  constructor(email: string) {
    super(`User with email ${email} not found`);
    this.name = "UserNotFoundError";
  }
}

export class RoleNotFoundError extends TeamServiceError {
  constructor(roleName: string) {
    super(`Role with name ${roleName} not found`);
    this.name = "RoleNotFoundError";
  }
}

export interface TeamMemberWithRole extends PrismaTeamMember {
  role: {
    name: string;
  };
}

export interface TeamInvitationWithTeam extends PrismaTeamInvitation {
  team: {
    id: string;
    name: string;
  };
}

export class TeamService {
  /**
   * Check if a user is a member of a team
   */
  static async isUserMemberOfTeam(
    userId: string,
    teamId: string
  ): Promise<boolean> {
    const teamMember = await prisma.teamMember.findFirst({
      where: {
        userId,
        teamId,
      },
    });
    return teamMember !== null;
  }

  /**
   * Get a user's role in a team
   */
  static async getUserTeamRole(
    userId: string,
    teamId: string
  ): Promise<string | null> {
    const teamMember = await prisma.teamMember.findFirst({
      where: {
        userId,
        teamId,
      },
      include: {
        role: true,
      },
    });
    if (!teamMember) {
      return null;
    }

    return teamMember.role.name;
  }

  /**
   * Check if an invitation exists for a user in a team
   */
  static async invitationExists(
    email: string,
    teamId: string
  ): Promise<boolean> {
    const teamInvitation = await prisma.teamInvitation.findFirst({
      where: { email, teamId, status: "PENDING" },
    });
    return teamInvitation !== null;
  }

  /**
   * Get a team by ID
   */
  static async getTeamById(teamId: string): Promise<PrismaTeam | null> {
    return await prisma.team.findUnique({
      where: { id: teamId },
    });
  }

  /**
   * Invite a member to a team
   */
  static async inviteMember(
    hostId: string,
    teamId: string,
    email: string
  ): Promise<PrismaTeamInvitation> {
    const team = await this.getTeamById(teamId);
    if (!team) {
      throw new TeamNotFoundError(teamId);
    }

    const invitee = await getUser(email);
    if (invitee) {
      const isUserMemberOfTeam = await this.isUserMemberOfTeam(
        invitee.id,
        teamId
      );

      if (isUserMemberOfTeam) {
        throw new UserAlreadyTeamMemberError(invitee.id, teamId);
      }
    }

    const existingTeamInvitation = await this.invitationExists(email, teamId);
    if (existingTeamInvitation) {
      throw new TeamServiceError(
        `Invitation for ${email} to team ${teamId} already exists`
      );
    }

    const host = await prisma.user.findUnique({
      where: { id: hostId },
      select: { name: true, email: true },
    });

    const hostName = host?.name || host?.email || "A team member";

    await sendInvitationEmail(email, team, hostName);

    try {
      return await prisma.teamInvitation.create({
        data: {
          email,
          teamId,
          hostId,
          status: "PENDING",
        },
      });
    } catch (error) {
      throw new TeamServiceError(
        `Failed to create invitation: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  /**
   * Accept a team invitation
   */
  static async acceptInvitation(
    invitationId: string
  ): Promise<TeamMemberWithRole> {
    const invitation = await prisma.teamInvitation.findUnique({
      where: { id: invitationId },
      include: {
        team: true,
      },
    });

    if (!invitation) {
      throw new InvitationNotFoundError(invitationId);
    }

    if (invitation.status !== "PENDING") {
      throw new InvitationNotPendingError(invitationId);
    }

    const user = await getUser(invitation.email);
    if (!user) {
      throw new UserNotFoundError(invitation.email);
    }

    const memberRole = await prisma.teamRole.findUnique({
      where: { name: "Member" },
    });

    if (!memberRole) {
      throw new RoleNotFoundError("Member");
    }

    const isAlreadyMember = await this.isUserMemberOfTeam(
      user.id,
      invitation.team.id
    );
    if (isAlreadyMember) {
      await prisma.teamInvitation.update({
        where: { id: invitationId },
        data: { status: "ACCEPTED" },
      });

      const existingMember = await prisma.teamMember.findFirst({
        where: {
          userId: user.id,
          teamId: invitation.team.id,
        },
        include: {
          role: true,
        },
      });

      if (!existingMember) {
        throw new TeamServiceError(
          `Failed to find existing team member for user ${user.id} in team ${invitation.team.id}`
        );
      }

      return existingMember as TeamMemberWithRole;
    }

    try {
      return await prisma.$transaction(async (tx) => {
        const teamMember = await tx.teamMember.create({
          data: {
            userId: user.id,
            teamId: invitation.team.id,
            roleId: memberRole.id,
          },
          include: {
            role: true,
          },
        });

        await tx.teamInvitation.update({
          where: { id: invitationId },
          data: { status: "ACCEPTED" },
        });

        return teamMember as TeamMemberWithRole;
      });
    } catch (error) {
      if (
        error instanceof Error &&
        error.message.includes("Unique constraint failed")
      ) {
        throw new UserAlreadyTeamMemberError(user.id, invitation.team.id);
      }

      throw new TeamServiceError(
        `Failed to accept invitation: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  /**
   * Reject a team invitation
   */
  static async rejectInvitation(
    invitationId: string
  ): Promise<PrismaTeamInvitation> {
    try {
      const invitation = await prisma.teamInvitation.findUnique({
        where: { id: invitationId },
      });

      if (!invitation) {
        throw new InvitationNotFoundError(invitationId);
      }

      return await prisma.teamInvitation.update({
        where: { id: invitationId },
        data: { status: "REJECTED" },
      });
    } catch (error) {
      if (error instanceof TeamServiceError) {
        throw error;
      }

      throw new TeamServiceError(
        `Failed to reject invitation: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  /**
   * Add a member to a team
   */
  static async addMemberToTeam(
    teamId: string,
    userId: string
  ): Promise<TeamMemberWithRole> {
    try {
      const team = await this.getTeamById(teamId);
      if (!team) {
        throw new TeamNotFoundError(teamId);
      }

      const isAlreadyMember = await this.isUserMemberOfTeam(userId, teamId);
      if (isAlreadyMember) {
        throw new UserAlreadyTeamMemberError(userId, teamId);
      }

      const memberRole = await prisma.teamRole.findUnique({
        where: { name: "Member" },
      });

      if (!memberRole) {
        throw new RoleNotFoundError("Member");
      }

      return (await prisma.teamMember.create({
        data: {
          userId,
          teamId,
          roleId: memberRole.id,
        },
        include: {
          role: true,
        },
      })) as TeamMemberWithRole;
    } catch (error) {
      if (error instanceof TeamServiceError) {
        throw error;
      }

      throw new TeamServiceError(
        `Failed to add member to team: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  static async getTeamByBoardId(boardId: string): Promise<PrismaTeam | null> {
    const board = await prisma.board.findUnique({
      where: { id: boardId },
      include: { team: true },
    });
    return board?.team || null;
  }
}
