import type { NextApiRequest, NextApiResponse } from "next";

/**
 * Simple ping endpoint to check server connectivity
 */
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
}
