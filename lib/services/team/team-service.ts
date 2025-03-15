import prisma from "@/db/prisma";
import { getUser } from "@/db/data";
import { sendInvitationEmail } from "@/lib/utils/mail";

export class TeamService {
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
    if (teamMember == null) {
      return null;
    }

    return teamMember.role.name;
  }

  static async invitationExists(email: string, teamId: string) {
    const teamInvitation = await prisma.teamInvitation.findFirst({
      where: { email, teamId, status: "PENDING" },
    });
    return teamInvitation !== null;
  }

  static async getTeamById(teamId: string) {
    const team = await prisma.team.findUnique({
      where: { id: teamId },
    });
    return team;
  }

  static async inviteMember(hostId: string, teamId: string, email: string) {
    const team = await this.getTeamById(teamId);
    if (team == null) {
      return null;
    }

    const invitee = await getUser(email);
    if (invitee !== null) {
      const isUserMemberOfTeam = await this.isUserMemberOfTeam(
        invitee.id,
        teamId
      );
      if (isUserMemberOfTeam) {
        return null;
      }
    }

    const host = await prisma.user.findUnique({
      where: { id: hostId },
      select: { name: true, email: true },
    });

    const hostName = host?.name || host?.email || "A team member";

    await sendInvitationEmail(email, team, hostName);
    const existingTeamInvitation = await this.invitationExists(email, teamId);
    if (existingTeamInvitation) {
      return null;
    }

    const teamInvitation = await prisma.teamInvitation.create({
      data: {
        email,
        teamId,
        hostId,
        status: "PENDING",
      },
    });

    return teamInvitation;
  }

  static async acceptInvitation(invitationId: string) {
    const invitation = await prisma.teamInvitation.findUnique({
      where: { id: invitationId },
      include: {
        team: true,
      },
    });
    if (invitation == null) {
      console.error("Invitation not found");
      return null;
    }
    if (invitation.status !== "PENDING") {
      console.error("Invitation not pending");
      return null;
    }
    const user = await getUser(invitation.email);
    if (user == null) {
      console.error("User not found");
      return null;
    }
    const memberRole = await prisma.teamRole.findUnique({
      where: { name: "Member" },
    });
    if (memberRole == null) {
      console.error("Member role not found");
      return null;
    }

    try {
      await prisma.$transaction(async (tx) => {
        const teamMember = await tx.teamMember.create({
          data: {
            userId: user.id,
            teamId: invitation.team.id,
            roleId: memberRole.id,
          },
        });
        if (teamMember == null) {
          throw new Error("Failed to add member to team");
        }
        await tx.teamInvitation.update({
          where: { id: invitationId },
          data: { status: "ACCEPTED" },
        });
        return teamMember;
      });
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  static async rejectInvitation(invitationId: string) {
    const invitation = await prisma.teamInvitation.update({
      where: { id: invitationId },
      data: { status: "REJECTED" },
    });
    return invitation;
  }

  static async addMemberToTeam(teamId: string, userId: string) {
    try {
      const memberRole = await prisma.teamRole.findUnique({
        where: { name: "Member" },
      });
      if (memberRole == null) {
        return null;
      }
      const teamMember = await prisma.teamMember.create({
        data: { userId, teamId, roleId: memberRole.id },
      });
      return teamMember;
    } catch (error) {
      console.error(error);
      return null;
    }
  }
}
