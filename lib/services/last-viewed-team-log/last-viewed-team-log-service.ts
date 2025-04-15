import prisma from "@/db/prisma";

export class LastViewedTeamLogService {
  /**
   * Gets the timestamp when a user last viewed notifications of a specific team
   *
   * @param userId - The ID of the user
   * @param teamId - The ID of the team
   * @returns The timestamp or null if not found
   */
  static async getTimestamp(
    userId: string,
    teamId: string
  ): Promise<Date | null> {
    const record = await prisma.userLastViewedTeamLog.findUnique({
      where: {
        userId_teamId: { userId, teamId },
      },
    });
    return record?.timestamp || null;
  }

  static async getUserTeamsTimestamp(
    userId: string
  ): Promise<Record<string, string>> {
    try {
      const records = await prisma.userLastViewedTeamLog.findMany({
        where: {
          userId,
        },
        orderBy: {
          timestamp: "desc",
        },
      });

      return records.reduce((acc, curr) => {
        acc[curr.teamId] = curr.timestamp.toISOString();
        return acc;
      }, {} as Record<string, string>);
    } catch (error) {
      console.error(error);
      return {};
    }
  }

  static async updateTimestamp(userId: string, teamId: string): Promise<void> {
    try {
      await prisma.userLastViewedTeamLog.upsert({
        where: { userId_teamId: { userId, teamId } },
        update: { timestamp: new Date() },
        create: { userId, teamId, timestamp: new Date() },
      });
    } catch (error) {
      console.error(error);
    }
  }
}
