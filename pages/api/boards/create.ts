import type { NextApiRequest, NextApiResponse } from "next";
import { createBoardSchemaWithTeamCheck } from "@/lib/schemas/board.schema";
import { BoardService } from "@/lib/services/board";
import { ZodError } from "zod";
import { withTeamRoleApi } from "@/lib/middleware";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { data, teamId } = req.body;
    if (!teamId) {
      return res.status(400).json({ message: "Team ID is required" });
    }

    const boardSchema = createBoardSchemaWithTeamCheck(teamId);
    const validatedData = await boardSchema.parseAsync(data);

    const boardService = new BoardService();

    const board = await boardService.create({
      name: validatedData.name,
      teamId,
    });

    return res.status(201).json(board);
  } catch (error) {
    if (error instanceof ZodError) {
      const errors = error.errors.map((err) => ({
        path: err.path.join("."),
        message: err.message,
      }));

      return res.status(400).json({
        message: "Validation error",
        errors,
      });
    }

    console.error("Board creation error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export default withTeamRoleApi(handler, {
  methods: ["POST"],
  requireAuth: true,
  resourceType: "team",
  role: ["Admin", "Member"],
  getResourceId: (req) => req.body.teamId,
});
