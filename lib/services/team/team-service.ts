import prisma from "@/db/prisma";
import { getUser } from "@/db/data";
import { sendInvitationEmail } from "@/lib/utils/mail";
import {
  Team as PrismaTeam,
  TeamInvitation as PrismaTeamInvitation,
  TeamMember as PrismaTeamMember,
  Board,
  User,
  TeamInvitationStatus,
  Team,
  TeamInvitation,
  Prisma,
  TeamAction,
  TeamRole,
  TeamLog,
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

export class TeamHasBoardsError extends TeamServiceError {
  constructor(teamId: string) {
    super(`Team with ID ${teamId} has boards`);
    this.name = "TeamHasBoardsError";
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

export interface TeamMemberWithRelations {
  id: string;
  teamId: string;
  userId: string;
  roleId: string;
  user: User;
  role: {
    id: string;
    name: string;
  };
}

type PrismaTransactionalClient = Prisma.TransactionClient;

export class TeamService {
  static async getTeamBoards(teamId: string): Promise<Board[]> {
    try {
      return await prisma.board.findMany({
        where: {
          teamId,
          archived: false,
        },
      });
    } catch (error) {
      console.error(error);
      return [];
    }
  }
  /**
   * Get member by user id and team id
   */
  static async getMember(
    userId: string,
    teamId: string
  ): Promise<TeamMemberWithRole | null> {
    try {
      const teamMember = await prisma.teamMember.findFirst({
        where: {
          userId,
          teamId,
        },
        include: {
          role: true,
        },
      });
      return teamMember;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  /**
   * Get a user's role in a team
   */
  static async getUserTeamRole(
    userId: string,
    teamId: string
  ): Promise<string | null> {
    try {
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
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  static async getUserInvitations(email: string): Promise<TeamInvitation[]> {
    try {
      return await prisma.teamInvitation.findMany({
        where: {
          email: email,
          status: TeamInvitationStatus.PENDING,
          team: { archived: false },
        },
        include: {
          team: {
            select: {
              name: true,
            },
          },
          host: {
            select: { name: true, email: true },
          },
        },
      });
    } catch (error) {
      console.error(error);
      return [];
    }
  }
  /**
   * Check if an invitation exists for a user in a team
   */
  static async invitationForEmailExists(
    email: string,
    teamId: string
  ): Promise<boolean> {
    const teamInvitation = await prisma.teamInvitation.findFirst({
      where: {
        email,
        teamId,
        status: TeamInvitationStatus.PENDING,
      },
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
    if (!team || team.archived) {
      throw new TeamNotFoundError(teamId);
    }

    const invitee = await getUser(email);
    if (invitee) {
      const member = await this.getMember(invitee.id, teamId);

      if (member) {
        throw new UserAlreadyTeamMemberError(invitee.id, teamId);
      }
    }

    const existingTeamInvitation = await this.invitationForEmailExists(
      email,
      teamId
    );
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
          status: TeamInvitationStatus.PENDING,
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

    if (invitation.status !== TeamInvitationStatus.PENDING) {
      throw new InvitationNotPendingError(invitationId);
    }

    const user = await getUser(invitation.email);
    if (!user) {
      throw new UserNotFoundError(invitation.email);
    }

    const member = await this.getMember(user.id, invitation.team.id);
    if (member) {
      await prisma.teamInvitation.update({
        where: { id: invitationId },
        data: { status: TeamInvitationStatus.ACCEPTED },
      });
      return member;
    }

    try {
      return await prisma.$transaction(async (tx) => {
        const teamMember = await this.createMember(
          invitation.team.id,
          user.id,
          tx
        );

        await tx.teamInvitation.update({
          where: { id: invitationId },
          data: { status: TeamInvitationStatus.ACCEPTED },
        });

        await tx.teamLog.create({
          data: {
            teamId: invitation.team.id,
            userId: invitation.hostId,
            action: TeamAction.MEMBER_ADDED,
            message: `User ${user.email} joined the team`,
          },
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
        data: { status: TeamInvitationStatus.REJECTED },
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
  static async createMember(
    teamId: string,
    userId: string,
    tx: PrismaTransactionalClient
  ): Promise<TeamMemberWithRole> {
    try {
      const memberRole = await tx.teamRole.findUnique({
        where: { name: "Member" },
      });

      if (!memberRole) {
        throw new RoleNotFoundError("Member");
      }

      return (await tx.teamMember.create({
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
        `Failed to create member: ${
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

  static async isAllBoardsArchived(teamId: string): Promise<boolean> {
    const boards = await prisma.board.findMany({
      where: { teamId, archived: false },
    });
    return boards.length === 0;
  }

  private static async deleteInvitations(teamId: string): Promise<boolean> {
    const deletedInvitations = await prisma.teamInvitation.deleteMany({
      where: { teamId },
    });
    return deletedInvitations.count > 0;
  }

  static async deleteTeam(teamId: string): Promise<void> {
    const team = await this.getTeamById(teamId);
    if (!team || team.archived) {
      throw new TeamNotFoundError(teamId);
    }
    if (!(await this.isAllBoardsArchived(teamId))) {
      throw new TeamHasBoardsError(teamId);
    }
    await this.deleteInvitations(teamId);
    await prisma.team.update({
      where: { id: teamId },
      data: { archived: true },
    });
  }

  static async getArchivedBaordsForTeams(teamIds: string[]): Promise<Board[]> {
    return await prisma.board.findMany({
      where: { teamId: { in: teamIds }, archived: true },
    });
  }

  /**
   * Delete a member from a team
   * @throws {TeamServiceError} If the member is the last admin of the team
   */
  static async deleteMember(
    teamId: string,
    memberId: string,
    userId: string
  ): Promise<boolean> {
    try {
      return await prisma.$transaction(async (tx) => {
        const member = await tx.teamMember.findUnique({
          where: { id: memberId },
          include: { role: true, user: true },
        });

        if (!member) {
          throw new TeamServiceError(
            `Team member with ID ${memberId} not found`
          );
        }
        const membersCount = await tx.teamMember.count({
          where: { teamId },
        });
        if (membersCount <= 1) {
          throw new TeamServiceError(
            "Cannot delete the last member of the team"
          );
        }
        if (member.role.name === "Admin") {
          const adminCount = await tx.teamMember.count({
            where: {
              teamId,
              role: {
                name: "Admin",
              },
            },
          });

          if (adminCount <= 1) {
            throw new TeamServiceError(
              "Cannot delete the last admin of the team"
            );
          }
        }

        await tx.teamMember.delete({
          where: { id: memberId },
        });

        await tx.teamLog.create({
          data: {
            teamId,
            userId,
            action: TeamAction.MEMBER_REMOVED,
            message: `User ${member.user.email} left the team`,
          },
        });

        return true;
      });
    } catch (error) {
      if (error instanceof TeamServiceError) {
        throw error;
      }

      throw new TeamServiceError(
        `Failed to delete team member: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  static async getMemberById(memberId: string): Promise<TeamMemberWithRole> {
    const member = await prisma.teamMember.findUnique({
      where: { id: memberId },
      include: { role: true, user: true },
    });
    if (!member) {
      throw new TeamServiceError(`Team member with ID ${memberId} not found`);
    }
    return member;
  }

  static async getTeamMembers(teamId: string): Promise<TeamMemberWithRole[]> {
    try {
      const members = await prisma.teamMember.findMany({
        where: { teamId },
        include: {
          user: true,
          role: true,
        },
      });

      return members;
    } catch (e) {
      console.error(e);
      return [];
    }
  }

  static async getBoardsIds(teamId: string): Promise<string[]> {
    const boards = await prisma.board.findMany({
      where: { teamId },
      select: { id: true },
    });
    return boards.map((board) => board.id);
  }

  static async getUserTeams(userId: string): Promise<Team[]> {
    try {
      const teams = await prisma.team.findMany({
        where: {
          members: {
            some: {
              userId,
            },
          },
          archived: false,
        },
      });
      return teams;
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  static async getRoleByName(roleName: string): Promise<TeamRole> {
    let role: TeamRole | null = null;
    try {
      role = await prisma.teamRole.findUnique({
        where: { name: roleName },
      });
    } catch (error) {
      console.error(error);
      throw new TeamServiceError(`Failed to get role by name: ${roleName}`);
    }
    if (!role) {
      throw new TeamServiceError(`Role with name ${roleName} not found`);
    }
    return role;
  }

  static async getTeamLogs(teamId: string): Promise<TeamLog[]> {
    try {
      const logs = await prisma.teamLog.findMany({
        where: {
          teamId,
        },
        include: {
          user: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      return logs;
    } catch (error) {
      console.error(error);
      return [];
    }
  }
  static async updateMemberRole(
    teamId: string,
    memberId: string,
    roleName: string,
    userId: string
  ): Promise<TeamMemberWithRole> {
    const member = await this.getMemberById(memberId);

    if (!member) {
      throw new TeamServiceError(`Team member with ID ${memberId} not found`);
    }

    if (member.role.name === "Admin" && roleName !== "Admin") {
      const adminCount = await prisma.teamMember.count({
        where: {
          teamId,
          role: {
            name: "Admin",
          },
        },
      });

      if (adminCount <= 1) {
        throw new TeamServiceError("Cannot remove the last admin of the team");
      }
    }

    const role = await this.getRoleByName(roleName);
    try {
      return await prisma.$transaction(async (tx) => {
        const updatedMember = await tx.teamMember.update({
          where: { id: memberId },
          data: { roleId: role.id },
          include: {
            user: true,
            role: true,
          },
        });

        await tx.teamLog.create({
          data: {
            teamId,
            userId,
            action: TeamAction.ROLE_UPDATED,
            message: `User ${updatedMember.user.email} role updated to ${roleName}`,
          },
        });
        return updatedMember;
      });
    } catch (error) {
      if (error instanceof TeamServiceError) {
        throw error;
      }
      throw new TeamServiceError(`Failed to update member role: ${error}`);
    }
  }
}
