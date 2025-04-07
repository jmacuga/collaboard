import { prisma } from "@/db/prisma";
import {
  TeamService,
  TeamServiceError,
} from "@/lib/services/team/team-service";
import { withTeamRoleApi } from "@/lib/middleware";
import { NextApiRequest, NextApiResponse } from "next";
import { authOptions } from "@/lib/auth/auth";
import { getServerSession } from "next-auth";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "PATCH") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const teamId = req.query.id as string;
  const memberId = req.query.memberId as string;
  const { role: newRoleName } = req.body;

  try {
    const session = await getServerSession(req, res, authOptions);
    if (!session?.user?.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const updatedMember = await TeamService.updateMemberRole(
      teamId,
      memberId,
      newRoleName,
      session.user.id
    );

    return res.status(200).json({
      success: true,
      message: "Member role updated successfully",
      data: updatedMember,
    });
  } catch (error) {
    if (error instanceof TeamServiceError) {
      return res.status(400).json({ message: error.message });
    }
    return res.status(500).json({ message: "Internal server error" });
  }
}

export default withTeamRoleApi(handler, {
  methods: ["PATCH"],
  requireAuth: true,
  resourceType: "team",
  role: ["Admin"],
  getResourceId: (req) => req.query.id as string,
});
