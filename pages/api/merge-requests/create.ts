import { NextApiRequest, NextApiResponse } from "next";
import { withTeamRoleApi } from "@/lib/middleware";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth";
import { MergeRequestService } from "@/lib/services/merge-request/merge-request-service";
async function handler(req: NextApiRequest, res: NextApiResponse) {
  let boardId;
  let changes;
  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    boardId = body.boardId;
    changes = body.changes.map((change: string) =>
      Buffer.from(change, "base64")
    );
  } catch (error) {
    return res.status(400).json({ message: "Invalid request body" });
  }

  const session = await getServerSession(req, res, authOptions);

  const mergeRequest = await MergeRequestService.createMergeRequest(
    session!.user!.id,
    boardId,
    changes
  );
  if (mergeRequest == null) {
    return res.status(400).json({ message: "An error occurred" });
  }

  return res.status(200).json({ message: "Invitation sent" });
}

export default withTeamRoleApi(handler, {
  methods: ["POST"],
  requireAuth: true,
  getResourceId: (req) => req.body.boardId,
  resourceType: "board",
  role: ["Admin", "Member"],
});
