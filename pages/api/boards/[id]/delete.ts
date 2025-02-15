import type { NextApiRequest, NextApiResponse } from "next";
import { BoardService } from "@/services/board";
import { getServerSession } from "next-auth/next";
import authOptions from "../../auth/[...nextauth]";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "DELETE") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const session = await getServerSession(req, res, authOptions);
    if (!session) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const boardId = req.query.id as string;
    console.log("Board ID:", boardId);
    if (!boardId) {
      return res.status(400).json({ message: "Board ID is required" });
    }

    const boardService = new BoardService();
    // const hasTeamAccess = await boardService.verifyTeamAccess(
    //   session.user.id,
    //   teamId
    // );
    // if (!hasTeamAccess) {
    //   return res
    //     .status(403)
    //     .json({ message: "Forbidden: No access to this team" });
    // }

    const board = await boardService.delete(boardId);

    return res.status(200).json({ message: "Board deleted successfully" });
  } catch (error) {
    console.error("Board deletion error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
