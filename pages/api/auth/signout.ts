import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";

/**
 * API endpoint for signing out a user
 *
 * @param req - The Next.js API request
 * @param res - The Next.js API response
 * @returns A JSON response indicating success or failure
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: "Method not allowed. Use POST instead.",
    });
  }

  try {
    const session = await getSession({ req });

    if (!session) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated",
      });
    }

    const cookieOptions = {
      expires: new Date(0),
      path: "/",
      httpOnly: true,
      sameSite: "lax" as const,
    };

    res.setHeader("Set-Cookie", [
      `next-auth.session-token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT; HttpOnly; SameSite=Lax`,
      `next-auth.callback-url=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT; HttpOnly; SameSite=Lax`,
      `next-auth.csrf-token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT; HttpOnly; SameSite=Lax`,
    ]);

    return res.status(200).json({
      success: true,
      message: "Successfully signed out",
    });
  } catch (error) {
    console.error("Sign out error:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred during sign out",
    });
  }
}
