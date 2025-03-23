import { prisma } from "@/db/prisma";
import { TeamServiceError } from "@/lib/services/team/team-service";
import { withTeamRoleApi } from "@/lib/middleware";
import { NextApiRequest, NextApiResponse } from "next";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "PATCH") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const teamId = req.query.id as string;
  const memberId = req.query.memberId as string;
  const { role: newRoleName } = req.body;

  try {
    const member = await prisma.teamMember.findUnique({
      where: { id: memberId },
      include: { role: true },
    });

    if (!member) {
      return res.status(404).json({ message: "Member not found" });
    }

    if (member.role.name === "Admin" && newRoleName !== "Admin") {
      const adminCount = await prisma.teamMember.count({
        where: {
          teamId,
          role: {
            name: "Admin",
          },
        },
      });

      if (adminCount <= 1) {
        throw new TeamServiceError("Cannot remove the last admin of the team");
      }
    }

    const newRole = await prisma.teamRole.findFirst({
      where: { name: newRoleName },
    });

    if (!newRole) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const updatedMember = await prisma.teamMember.update({
      where: { id: memberId },
      data: { roleId: newRole.id },
      include: {
        user: true,
        role: true,
      },
    });

    return res.status(200).json(updatedMember);
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
