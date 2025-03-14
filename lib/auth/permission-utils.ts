import { BoardService } from "../services/board/board-service";
import { TeamService } from "../services/team/team-service";

export async function hasTeamPermission(
  userId: string,
  teamId: string
): Promise<boolean> {
  const userRole = await TeamService.getUserTeamRole(userId, teamId);
  if (!userRole) {
    return false;
  }

  return true;
}

export async function hasBoardPermission(
  userId: string,
  boardId: string
): Promise<boolean> {
  const teamId = await BoardService.getTeamIdByBoardId(boardId);
  if (!teamId) {
    return false;
  }
  const userRole = await TeamService.getUserTeamRole(userId, teamId);
  if (!userRole) {
    return false;
  }

  return true;
}

export async function isTeamAdmin(
  userId: string,
  teamId: string
): Promise<boolean> {
  const userRole = await TeamService.getUserTeamRole(userId, teamId);
  return userRole === "Admin";
}

export async function isBoardAdmin(
  userId: string,
  boardId: string
): Promise<boolean> {
  const teamId = await BoardService.getTeamIdByBoardId(boardId);
  if (!teamId) {
    return false;
  }
  return isTeamAdmin(userId, teamId);
}
