import { NextApiRequest, NextApiResponse } from "next";
import { withTeamRoleApi } from "@/lib/middleware";
import { MergeRequestService } from "@/lib/services/merge-request/merge-request-service";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  let changes;
  let boardId;
  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    boardId = body.boardId;
    changes = body.changes.map((change: string) =>
      Buffer.from(change, "base64")
    );
  } catch (error) {
    return res.status(400).json({ message: "Invalid request body" });
  }

  const mergeRequestId = req.query.id as string;

  await MergeRequestService.update(mergeRequestId, changes);

  return res.status(200).json({ message: "Merge request updated" });
}

export default withTeamRoleApi(handler, {
  methods: ["POST"],
  requireAuth: true,
  getResourceId: (req) => req.body.boardId,
  resourceType: "board",
  role: ["Admin", "Member"],
});
