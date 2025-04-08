import { withTeamRoleApi } from "@/lib/middleware";
import { BoardService } from "@/lib/services/board/board-service";
import { NextApiRequest, NextApiResponse } from "next";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const boardId = req.query.id as string;
  const board = await BoardService.getBoardById(boardId);
  res.status(200).json(board);
}

export default withTeamRoleApi(handler, {
  methods: ["GET"],
  requireAuth: true,
  resourceType: "board",
  role: ["Admin", "Member"],
  getResourceId: (req) => req.query.id as string,
});
