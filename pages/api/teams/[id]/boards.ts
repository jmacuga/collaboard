import type { NextApiRequest, NextApiResponse } from "next";
import { withTeamRoleApi } from "@/lib/middleware";
import { TeamService } from "@/lib/services/team/team-service";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const teamId = req.query?.id as string;
  const boards = await TeamService.getTeamBoards(teamId);
  return res.status(200).json({ boards });
}

export default withTeamRoleApi(handler, {
  methods: ["GET"],
  requireAuth: true,
  resourceType: "team",
  role: ["Admin", "Member"],
  getResourceId: (req) => req.query.id as string,
});
