import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth/auth";
import { getBoardDocUrl } from "@/db/data";
import { hasBoardPermission } from "@/lib/auth/permission-utils";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const session = await getServerSession(req, res, authOptions);
    if (!session) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const boardId = req.query.id as string;
    if (!boardId) {
      return res.status(400).json({ message: "Board ID is required" });
    }

    const hasPermission = await hasBoardPermission(session.user.id, boardId);
    if (!hasPermission) {
      return res
        .status(403)
        .json({ message: "Forbidden: No access to this board" });
    }

    const docUrl = await getBoardDocUrl(boardId);

    return res.status(200).json({ docUrl });
  } catch (error) {
    console.error("Board doc URL retrieval error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
