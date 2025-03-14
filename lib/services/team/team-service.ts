import prisma from "@/db/prisma";

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
}
