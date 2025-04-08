import { NextApiRequest, NextApiResponse } from "next";
import { withTeamRoleApi } from "@/lib/middleware";
import { TeamService } from "@/lib/services/team/team-service";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth";
import { prisma } from "@/db/prisma";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const teamId = req.query.id as string;
    const session = await getServerSession(req, res, authOptions);

    if (!session) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userId = session.user.id;
    const member = await prisma.teamMember.findFirst({
      where: {
        teamId,
        userId,
      },
    });

    if (!member) {
      return res.status(404).json({ message: "Member not found" });
    }

    await TeamService.deleteMember(teamId, member.id);

    return res.status(200).json({ message: "Successfully left the team" });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({ message: error.message });
    }
    return res.status(500).json({ message: "Internal server error" });
  }
}

export default withTeamRoleApi(handler, {
  methods: ["POST"],
  requireAuth: true,
  resourceType: "team",
  role: ["Admin", "Member"],
  getResourceId: (req) => req.query.id as string,
});
