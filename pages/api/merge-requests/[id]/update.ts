import { NextApiRequest, NextApiResponse } from "next";
import { withTeamRoleApi } from "@/lib/middleware";
import {
  MergeRequestError,
  MergeRequestService,
} from "@/lib/services/merge-request/merge-request-service";

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
  try {
    await MergeRequestService.update(mergeRequestId, changes);
  } catch (error) {
    if (error instanceof MergeRequestError) {
      return res.status(400).json({ message: error.message });
    }
    console.error("Error updating merge request:", error);
    return res.status(500).json({ message: "Error updating merge request" });
  }

  return res.status(200).json({ message: "Merge request updated" });
}

export default withTeamRoleApi(handler, {
  methods: ["POST"],
  requireAuth: true,
  getResourceId: (req) => req.body.boardId,
  resourceType: "board",
  role: ["Admin", "Member"],
});
