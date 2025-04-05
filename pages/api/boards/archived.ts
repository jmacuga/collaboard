import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/db/prisma";
import { TeamService } from "@/lib/services/team/team-service";
import { withApi } from "@/lib/middleware";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth";

interface BoardInfo {
  id: string;
  automergeDocId: string | null;
}

/**
 * API endpoint to fetch boards to cleanup for a user
 * This endpoint is used to clean up boards that are archived or inaccessible
 * It takes a list of local board IDs and returns a list of boards to cleanup
 */
async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await await getServerSession(req, res, authOptions);

  const localBoardIds = req.body?.localBoardIds || [];

  const teams = await TeamService.getUserTeams(session!.user.id);
  const teamIds = teams.map((team) => team.id);
  const archivedBoards = await TeamService.getArchivedBaordsForTeams(teamIds);

  let inaccessibleBoards: BoardInfo[] = [];

  if (localBoardIds.length > 0) {
    inaccessibleBoards = await prisma.board.findMany({
      where: {
        automergeDocId: { in: localBoardIds },
        teamId: { notIn: teamIds },
      },
      select: {
        id: true,
        automergeDocId: true,
      },
    });
  }

  const boardsToCleanup = [...archivedBoards, ...inaccessibleBoards]
    .filter((board) => board.automergeDocId !== null)
    .map((board) => ({
      id: board.id,
      docId: board.automergeDocId,
    }));

  return res.status(200).json({ boards: boardsToCleanup });
}

export default withApi(handler, {
  methods: ["POST"],
  requireAuth: true,
});
