import { getUser } from "@/db/data";
import { NextApiRequest, NextApiResponse } from "next";
import { TeamService } from "@/lib/services/team/team-service";
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const id = req.query.id as string;

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const invitation = await TeamService.rejectInvitation(id as string);
  if (invitation == null) {
    return res.status(400).json({ error: "Failed to reject invitation" });
  }
  return res.status(200).json({ message: "Invitation rejected" });
}
