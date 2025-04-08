import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth/auth";
import { NotificationService } from "@/lib/services/notification/notification-service";
import { withApiAuth } from "@/lib/middleware/with-api-auth";
import { UserLastViewedLogType } from "@prisma/client";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const session = await getServerSession(req, res, authOptions);
    if (!session) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { type = UserLastViewedLogType.ALL, teamId, boardId } = req.body;
    await NotificationService.updateLastViewedTimestamp(
      session.user.id,
      type,
      teamId,
      boardId
    );

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error marking notifications as viewed:", error);
    return res.status(500).json({
      message: "Failed to mark notifications as viewed",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

export default withApiAuth(handler, {
  methods: ["POST"],
  requireAuth: true,
});
