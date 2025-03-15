import type { NextApiRequest, NextApiResponse } from "next";
import { schemaBoard } from "@/lib/schemas/board.schema";
import { BoardService } from "@/lib/services/board";
import { ZodError } from "zod";
import { withTeamMemberApi } from "@/lib/middleware";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { data, teamId } = req.body;
    if (!teamId) {
      return res.status(400).json({ message: "Team ID is required" });
    }

    const validatedData = schemaBoard.parse(data);

    const boardService = new BoardService();

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

export default withTeamMemberApi(handler, {
  methods: ["POST"],
  requireAuth: true,
  getTeamId: (req) => req.body.teamId,
});
