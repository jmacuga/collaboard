import { authOptions } from "@/lib/auth/auth";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { withTeamRoleApi } from "@/lib/middleware";
import {
  TeamNotFoundError,
  TeamService,
} from "@/lib/services/team/team-service";
import { TeamHasBoardsError } from "@/lib/services/team/team-service";
async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    await TeamService.deleteTeam(req.query.id as string);
  } catch (e) {
    if (e instanceof TeamHasBoardsError) {
      return res.status(400).json({ message: "Team has boards" });
    }
    if (e instanceof TeamNotFoundError) {
      return res.status(404).json({ message: "Team not found" });
    }
    return res.status(500).json({ message: "Internal server error" });
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
