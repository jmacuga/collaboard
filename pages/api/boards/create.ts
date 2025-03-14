import type { NextApiRequest, NextApiResponse } from "next";
import { schemaBoard } from "@/lib/schemas/board.schema";
import { BoardService } from "@/lib/services/board";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth/auth";
import { ZodError } from "zod";
import { hasTeamPermission } from "@/lib/auth/permission-utils";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const session = await getServerSession(req, res, authOptions);
    if (!session) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { data, teamId } = req.body;
    if (!teamId) {
      return res.status(400).json({ message: "Team ID is required" });
    }

    const validatedData = schemaBoard.parse(data);

    const boardService = new BoardService();

    const hasPermission = await hasTeamPermission(session.user.id, teamId);
    if (!hasPermission) {
      return res
        .status(403)
        .json({ message: "Forbidden: No access to this team" });
    }

    const board = await boardService.create({
      name: validatedData.name,
      teamId,
    });

    return res.status(201).json(board);
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({ message: error.message });
    }

    console.error("Board creation error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
