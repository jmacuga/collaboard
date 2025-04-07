import { prisma } from "@/db/prisma";

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
  static async updateLastViewedTimestamp(userId: string, type: string = "all") {
    return prisma.userLastViewedLog.upsert({
      where: {
        userId_type: { userId, type },
      },
      update: {
        timestamp: new Date(),
      },
      create: {
        userId,
        type,
        timestamp: new Date(),
      },
    });
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
    type: string = "all"
  ): Promise<Date | null> {
    const record = await prisma.userLastViewedLog.findUnique({
      where: {
        userId_type: { userId, type },
      },
      select: {
        timestamp: true,
      },
    });

    return record?.timestamp || null;
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
    return this.getLastViewedTimestamp(userId, `team:${teamId}`);
  }

  /**
   * Updates the timestamp when a user last viewed team notifications
   *
   * @param userId - The ID of the user
   * @param teamId - The ID of the team
   * @returns The updated record
   */
  static async updateLastViewedTeamTimestamp(userId: string, teamId: string) {
    return this.updateLastViewedTimestamp(userId, `team:${teamId}`);
  }
}
