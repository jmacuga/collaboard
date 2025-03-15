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
}
