import type { NextApiRequest, NextApiResponse } from "next";
import { BoardService } from "@/lib/services/board/board-service";
import { withTeamRoleApi } from "@/lib/middleware";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const docUrl = await BoardService.getBoardDocUrl(req.query?.id as string);
  return res.status(200).json({ docUrl });
}

export default withTeamRoleApi(handler, {
  methods: ["GET"],
  requireAuth: true,
  resourceType: "board",
  role: ["Admin", "Member"],
  getResourceId: (req) => req.query.id as string,
});
