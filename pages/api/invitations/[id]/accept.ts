import { NextApiRequest, NextApiResponse } from "next";
import { TeamService } from "@/lib/services/team/team-service";
import { withTeamApi, ApiResponse } from "@/lib/middleware";

/**
 * API endpoint for accepting a team invitation
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

  const teamMember = await TeamService.acceptInvitation(invitationId);

  return res.status(200).json({
    success: true,
    message: "Invitation accepted successfully",
    data: teamMember,
  });
}

export default withTeamApi(handler, {
  methods: ["POST"],
  requireAuth: true,
});
