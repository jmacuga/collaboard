import { schemaTeamInvitation } from "@/lib/schemas/team-invitation.schema";
import { TeamService } from "@/lib/services/team/team-service";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth/auth";
import { NextApiRequest, NextApiResponse } from "next";
import { getUser } from "@/db/data";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  let email;
  let teamId;
  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    email = body.email;
    teamId = body.teamId;
  } catch (error) {
    return res.status(400).json({ message: "Invalid request body" });
  }

  const hasPermission = await TeamService.isUserMemberOfTeam(
    session.user.id,
    teamId
  );
  if (!hasPermission) {
    return res.status(403).json({ message: "Forbidden" });
  }

  const { success } = schemaTeamInvitation.safeParse({ email });
  if (!success) {
    return res.status(400).json({ message: "Invalid email" });
  }
  if (email === session.user.email) {
    return res.status(400).json({ message: "Cannot invite yourself" });
  }

  const invitee = await getUser(email);
  if (invitee !== null) {
    if (await TeamService.isUserMemberOfTeam(invitee.id, teamId)) {
      return res
        .status(400)
        .json({ message: "User is already a member of team" });
    }
  }
  if (await TeamService.invitationExists(email, teamId)) {
    return res.status(400).json({ message: "User already invited" });
  }

  const hostId = session.user.id;

  const teamInvitation = await TeamService.inviteMember(hostId, teamId, email);
  if (teamInvitation == null) {
    return res.status(400).json({ message: "An error occurred" });
  }

  return res.status(200).json({ message: "Invitation sent" });
}
