import type { NextApiRequest, NextApiResponse } from "next";
import { getBoardDocUrl } from "@/db/data";
import { withTeamMemberApi } from "@/lib/middleware";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const docUrl = await getBoardDocUrl(req.query?.id as string);
  return res.status(200).json({ docUrl });
}

export default withTeamMemberApi(handler, {
  methods: ["GET"],
  requireAuth: true,
  getTeamId: (req) => req.query.id as string,
});
