import { prisma } from "@/db/prisma";
import { authOptions } from "@/lib/auth/auth";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { withApiAuth } from "@/lib/middleware";
import { TeamService } from "@/lib/services/team/team-service";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const { name } = req.body;

  const team = await TeamService.createTeam(name, session.user.id);

  return res.status(200).json(team);
}

export default withApiAuth(handler, {
  methods: ["POST"],
  requireAuth: true,
});
