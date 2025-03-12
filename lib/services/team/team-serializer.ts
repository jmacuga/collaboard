import { Board, Team, User } from "@prisma/client";
import {
  createBoard,
  getBoardById,
  getUser,
  getUserTeams,
  getTeamBoards,
  getTeam,
  updateBoard,
  getBoardDocUrl,
} from "@/db/data";

import { Serializer } from "@/lib/utils/serialize-data";

export class TeamService {
  static async getUserTeams(userId: string): Promise<Team[] | null> {
    try {
      const teams = await getUserTeams(userId);
      return teams ? Serializer.serializeDate(teams) : null;
    } catch (error) {
      console.error("TeamService.getUserTeams error:", error);
      return null;
    }
  }

  static async getTeamBoards(teamId: string): Promise<Board[] | null> {
    try {
      const boards = await getTeamBoards(teamId);
      return boards ? Serializer.serializeDate(boards) : null;
    } catch (error) {
      console.error("TeamService.getTeamBoards error:", error);
      return null;
    }
  }

  static async getTeam(id: string): Promise<Team | null> {
    try {
      const team = await getTeam(id);
      return team ? Serializer.serializeDate(team) : null;
    } catch (error) {
      console.error("TeamService.getTeam error:", error);
      return null;
    }
  }
}
