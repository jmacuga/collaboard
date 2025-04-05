import { NextApiRequest, NextApiResponse } from "next";
import { withTeamRoleApi } from "@/lib/middleware";
import { TeamService } from "@/lib/services/team/team-service";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const teamId = req.query.id as string;
    const memberId = req.query.memberId as string;

    const userMember = await TeamService.getMemberById(memberId);

    const sessionUser = await getServerSession(req, res, authOptions);
    if (userMember.userId === sessionUser?.user.id) {
      return res.status(400).json({ message: "You cannot delete yourself" });
    }

    await TeamService.deleteMember(teamId, memberId);
    return res.status(200).json({ message: "Member deleted successfully" });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({ message: error.message });
    }
    return res.status(500).json({ message: "Internal server error" });
  }
}

export default withTeamRoleApi(handler, {
  methods: ["DELETE"],
  requireAuth: true,
  resourceType: "team",
  role: ["Admin"],
  getResourceId: (req) => req.query.id as string,
});
