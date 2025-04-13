import { prisma } from "@/db/prisma";
import { UserLastViewedLog, UserLastViewedLogType } from "@prisma/client";
/**
 * Service for managing user notification preferences and tracking viewed status
 */
export class NotificationService {
  /**
   * Updates the timestamp when a user last viewed notifications
   *
   * @param userId - The ID of the user
   * @param type - The type of notification view (e.g., "all", "team:{teamId}")
   * @returns The updated record
   */
  static async updateLastViewedTimestamp(
    userId: string,
    type: UserLastViewedLogType = UserLastViewedLogType.ALL,
    teamId?: string,
    boardId?: string
  ) {
    if (type === UserLastViewedLogType.ALL) {
      const log = await prisma.userLastViewedLog.findFirst({
        where: {
          userId,
          type,
        },
      });
      if (log) {
        return prisma.userLastViewedLog.update({
          where: { id: log.id },
          data: { timestamp: new Date() },
        });
      } else {
        return prisma.userLastViewedLog.create({
          data: {
            userId,
            type,
            timestamp: new Date(),
          },
        });
      }
    } else if (type === UserLastViewedLogType.TEAM && teamId) {
      return prisma.userLastViewedLog.upsert({
        where: {
          userId_type_teamId: { userId, type, teamId },
        },
        update: {
          timestamp: new Date(),
        },
        create: {
          userId,
          type,
          timestamp: new Date(),
          teamId,
        },
      });
    } else if (type === UserLastViewedLogType.BOARD && boardId) {
      return prisma.userLastViewedLog.upsert({
        where: {
          userId_type_boardId: { userId, type, boardId },
          boardId,
        },
        update: {
          timestamp: new Date(),
        },
        create: {
          userId,
          type,
          timestamp: new Date(),
          boardId,
        },
      });
    }
  }

  /**
   * Gets the timestamp when a user last viewed notifications of a specific type
   *
   * @param userId - The ID of the user
   * @param type - The type of notification view (e.g., "all", "team:{teamId}")
   * @returns The timestamp or null if not found
   */
  static async getLastViewedTimestamp(
    userId: string,
    type: UserLastViewedLogType = UserLastViewedLogType.ALL,
    teamId?: string,
    boardId?: string
  ): Promise<Date | null> {
    let record: UserLastViewedLog | null = null;
    if (type === UserLastViewedLogType.ALL) {
      record = await prisma.userLastViewedLog.findFirst({
        where: {
          userId,
          type,
        },
      });
    } else if (type === UserLastViewedLogType.TEAM && teamId) {
      record = await prisma.userLastViewedLog.findUnique({
        where: {
          userId_type_teamId: { userId, type, teamId },
        },
      });
    } else if (type === UserLastViewedLogType.BOARD && boardId) {
      record = await prisma.userLastViewedLog.findUnique({
        where: {
          userId_type_boardId: { userId, type, boardId },
        },
      });
    }

    return record?.timestamp || null;
  }

  static async getLastViewedUserTeamsTimestamps(
    userId: string
  ): Promise<Record<string, string>> {
    try {
      const record = await prisma.userLastViewedLog.findMany({
        where: {
          userId,
          type: {
            in: [UserLastViewedLogType.TEAM],
          },
        },
        orderBy: {
          timestamp: "desc",
        },
      });

      return record.reduce((acc, curr) => {
        if (curr.teamId) {
          acc[curr.teamId] = curr.timestamp.toISOString();
        }
        return acc;
      }, {} as Record<string, string>);
    } catch (error) {
      console.error(error);
      return {};
    }
  }

  /**
   * Gets the timestamp when a user last viewed notifications of a specific team
   *
   * @param userId - The ID of the user
   * @param teamId - The ID of the team
   * @returns The timestamp or null if not found
   */
  static async getLastViewedTeamTimestamp(
    userId: string,
    teamId: string
  ): Promise<Date | null> {
    return this.getLastViewedTimestamp(
      userId,
      UserLastViewedLogType.TEAM,
      teamId
    );
  }

  /**
   * Updates the timestamp when a user last viewed team notifications
   *
   * @param userId - The ID of the user
   * @param teamId - The ID of the team
   * @returns The updated record
   */
}
