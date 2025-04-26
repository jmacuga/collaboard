import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth/auth";
import { LastViewedBoardLogService } from "@/lib/services/last-viewed-board-log/last-viewed-board-log-service";
import { withApiAuth } from "@/lib/middleware/with-api-auth";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const session = await getServerSession(req, res, authOptions);
    if (!session) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { boardId } = req.query;

    const lastViewed = await LastViewedBoardLogService.getTimestamp(
      session.user.id,
      boardId as string
    );
    return res.status(200).json({ lastViewed });
  } catch (error) {
    console.error("Error marking notifications as viewed:", error);
    return res.status(500).json({
      message: "Failed to mark notifications as viewed",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

export default withApiAuth(handler, {
  methods: ["GET"],
  requireAuth: true,
});
