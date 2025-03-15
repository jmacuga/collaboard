import { schemaTeamInvitation } from "@/lib/schemas/team-invitation.schema";
import { TeamService } from "@/lib/services/team/team-service";
import { NextApiRequest, NextApiResponse } from "next";
import { withTeamRoleApi } from "@/lib/middleware";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth";
async function handler(req: NextApiRequest, res: NextApiResponse) {
  let email;
  let teamId;
  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    email = body.email;
    teamId = body.teamId;
  } catch (error) {
    return res.status(400).json({ message: "Invalid request body" });
  }

  const session = await getServerSession(req, res, authOptions);
  const teamInvitation = await TeamService.inviteMember(
    session!.user!.id,
    teamId,
    email
  );
  if (teamInvitation == null) {
    return res.status(400).json({ message: "An error occurred" });
  }

  return res.status(200).json({ message: "Invitation sent" });
}

export default withTeamRoleApi(handler, {
  methods: ["POST"],
  requireAuth: true,
  getResourceId: (req) => req.body.teamId,
  resourceType: "team",
  role: ["Admin", "Member"],
});
