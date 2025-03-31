import { authOptions } from "@/lib/auth/auth";
import { withTeamRoleApi } from "@/lib/middleware";
import { MergeRequestService } from "@/lib/services/merge-request/merge-request-service";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  const { boardId } = req.body;

  if (!boardId) {
    return res.status(400).json({ message: "Board ID is required" });
  }
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const userId = session.user.id;
  const result = await MergeRequestService.getMergeRequestById(id as string);
  const requesterId = result?.mergeRequest.requesterId;

  if (!result) {
    return res.status(404).json({ message: "Merge request not found" });
  }
  if (requesterId !== userId) {
    return res
      .status(403)
      .json({ message: "You are not the author of this merge request" });
  }
  try {
    await MergeRequestService.close(id as string);
    return res.status(200).json({ message: "Merge request closed" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to close merge request" });
  }
}

export default withTeamRoleApi(handler, {
  methods: ["POST"],
  requireAuth: true,
  resourceType: "board",
  role: ["Admin", "Member"],
  getResourceId: (req) => req.body.boardId as string,
});
