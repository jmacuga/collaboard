import type { NextApiRequest, NextApiResponse } from "next";
import { BoardService } from "@/lib/services/board";
import { withTeamRoleApi } from "@/lib/middleware";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const boardId = req.query.id as string;
    if (!boardId) {
      return res.status(400).json({ message: "Board ID is required" });
    }

    const board = await BoardService.archive(boardId);

    return res.status(200).json({ message: "Board deleted successfully" });
  } catch (error) {
    console.error("Board deletion error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export default withTeamRoleApi(handler, {
  methods: ["DELETE"],
  requireAuth: true,
  resourceType: "board",
  role: ["Admin"],
  getResourceId: (req) => req.query.id as string,
});
