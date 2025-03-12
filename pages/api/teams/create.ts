import { prisma } from "@/db/prisma";
import { authOptions } from "@/lib/auth/auth";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { ZodError } from "zod";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }
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
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({ message: error.message });
    }

    return res.status(500).json({ error: "Internal server error" });
  }
}
