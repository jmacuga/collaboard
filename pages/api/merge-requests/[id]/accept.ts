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
  if (!result) {
    return res.status(404).json({ message: "Merge request not found" });
  }
  const isUserReviewer = await MergeRequestService.isUserReviewer(
    userId,
    id as string
  );
  if (!isUserReviewer) {
    return res.status(403).json({ message: "You are not a reviewer" });
  }
  try {
    await MergeRequestService.accept(userId, id as string);
    return res.status(200).json({ message: "Merge request accepted" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to accept merge request" });
  }
}

export default withTeamRoleApi(handler, {
  methods: ["POST"],
  requireAuth: true,
  resourceType: "board",
  role: ["Admin", "Member"],
  getResourceId: (req) => req.body.boardId as string,
});
