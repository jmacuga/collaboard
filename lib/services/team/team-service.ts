import prisma from "@/db/prisma";

export class TeamService {
  static async isUserMemberOfTeam(
    userId: string,
    teamId: string
  ): Promise<boolean> {
    const member = await prisma.teamMember.findFirst({
      where: {
        userId,
        teamId,
      },
    });

    return !!member;
  }
}
