import { prisma } from "@/db/prisma";
import { authOptions } from "@/lib/auth/auth";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { withApiAuth, withTeamRoleApi } from "@/lib/middleware";
import { TeamService } from "@/lib/services/team/team-service";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const deleted = await TeamService.deleteTeam(req.query.id as string);
  if (!deleted) {
    return res.status(400).json({ message: "Team not found or has boards" });
  }
  return res.status(200).json({ message: "Team deleted successfully" });
}

export default withTeamRoleApi(handler, {
  methods: ["DELETE"],
  requireAuth: true,
  resourceType: "team",
  role: ["Admin"],
  getResourceId: (req) => req.query.id as string,
});
