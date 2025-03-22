import { NextApiRequest, NextApiResponse } from "next";
import { TeamService } from "@/lib/services/team/team-service";
import { withCollaboardApi } from "@/lib/middleware";
import { ApiResponse } from "@/lib/middleware/with-api-auth";

/**
 * API endpoint for rejecting a team invitation
 *
 * @param req - The Next.js API request
 * @param res - The Next.js API response
 * @returns A JSON response indicating success or failure
 */
async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>,
  session: any
) {
  const invitationId = req.query.id as string;
  if (!invitationId) {
    return res.status(400).json({
      success: false,
      error: "Missing invitation ID",
    });
  }

  const invitation = await TeamService.rejectInvitation(invitationId);

  return res.status(200).json({
    success: true,
    message: "Invitation rejected successfully",
    data: invitation,
  });
}

export default withCollaboardApi(handler, {
  methods: ["POST"],
  requireAuth: true,
});
