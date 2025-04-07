import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth/auth";
import { NotificationService } from "@/lib/services/notification/notification-service";
import { withApiAuth } from "@/lib/middleware/with-api-auth";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const session = await getServerSession(req, res, authOptions);
    if (!session) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { type = "all", teamId } = req.body;

    if (teamId) {
      await NotificationService.updateLastViewedTeamTimestamp(
        session.user.id,
        teamId
      );
    } else {
      await NotificationService.updateLastViewedTimestamp(
        session.user.id,
        type
      );
    }

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
