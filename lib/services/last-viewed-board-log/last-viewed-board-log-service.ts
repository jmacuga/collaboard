import prisma from "@/db/prisma";

export class LastViewedBoardLogService {
  static async getTimestamp(
    userId: string,
    boardId: string
  ): Promise<Date | null> {
    try {
      const record = await prisma.userLastViewedBoardLog.findUnique({
        where: { userId_boardId: { userId, boardId } },
      });
      return record?.timestamp || null;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  static async getUserBoardsTimestamps(
    userId: string
  ): Promise<Record<string, Date>> {
    try {
      const records = await prisma.userLastViewedBoardLog.findMany({
        where: { userId },
        orderBy: { timestamp: "desc" },
      });
      return records.reduce((acc, curr) => {
        acc[curr.boardId] = curr.timestamp;
        return acc;
      }, {} as Record<string, Date>);
    } catch (error) {
      console.error(error);
      return {};
    }
  }

  static async updateTimestamp(userId: string, boardId: string): Promise<void> {
    try {
      await prisma.userLastViewedBoardLog.upsert({
        where: { userId_boardId: { userId, boardId } },
        update: { timestamp: new Date() },
        create: { userId, boardId, timestamp: new Date() },
      });
    } catch (error) {
      console.error(error);
    }
  }
}
