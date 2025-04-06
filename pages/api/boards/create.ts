import type { NextApiRequest, NextApiResponse } from "next";
import {
  createBoardSchemaWithTeamCheck,
  BoardNameNotUniqueError,
} from "@/lib/schemas/board.schema";
import { BoardService } from "@/lib/services/board";
import { ZodError } from "zod";
import { withTeamRoleApi } from "@/lib/middleware";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth";

type ErrorResponse = {
  message: string;
  errors?: Array<{
    path: string;
    message: string;
  }>;
};

async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { data, teamId } = req.body;

    if (!teamId) {
      return res.status(400).json({ message: "Team ID is required" });
    }

    const session = await getServerSession(req, res, authOptions);

    if (!session) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const boardSchema = createBoardSchemaWithTeamCheck(teamId);
    const validatedData = await boardSchema.parseAsync(data);

    const board = await BoardService.create({
      name: validatedData.name,
      teamId,
      userId: session.user.id,
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
      } as ErrorResponse);
    }

    if (error instanceof BoardNameNotUniqueError) {
      return res.status(409).json({
        message: error.message,
        errors: [{ path: "name", message: error.message }],
      } as ErrorResponse);
    }

    console.error("Board creation error:", error);
    return res
      .status(500)
      .json({ message: "Internal server error" } as ErrorResponse);
  }
}

export default withTeamRoleApi(handler, {
  methods: ["POST"],
  requireAuth: true,
  resourceType: "team",
  role: ["Admin", "Member"],
  getResourceId: (req) => req.body.teamId,
});
