import { prisma } from "@/db/prisma";
import { authOptions } from "@/lib/auth/auth";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { withApiAuth } from "@/lib/middleware";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const { name } = req.body;

  const team = await prisma.team.create({
    data: {
      name,
    },
  });
  const adminRole = await prisma.teamRole.findFirst({
    where: {
      name: "Admin",
    },
  });
  if (!adminRole) {
    return res.status(500).json({ error: "Admin role not found" });
  }

  await prisma.teamMember.create({
    data: {
      teamId: team.id,
      userId: session.user.id,
      roleId: adminRole.id,
    },
  });

  return res.status(200).json(team);
}

export default withApiAuth(handler, {
  methods: ["POST"],
  requireAuth: true,
});
