import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth/auth";
import { LastViewedTeamLogService } from "@/lib/services/last-viewed-team-log/last-viewed-team-log-service";
import { withApiAuth } from "@/lib/middleware/with-api-auth";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const session = await getServerSession(req, res, authOptions);
    if (!session) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { teamId } = req.query;
    if (!teamId) {
      return res.status(400).json({ message: "Team ID is required" });
    }

    const lastViewed = await LastViewedTeamLogService.getTimestamp(
      session.user.id,
      teamId as string
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
