import { NextApiRequest, NextApiResponse } from "next";
import { TeamService } from "@/lib/services/team/team-service";
import { ApiResponse } from "./with-api-auth";
/**
 * Options for the team member check middleware
 */
export type TeamMemberCheckOptions = {
  /**
   * Function to extract the team ID from the request
   * Default: Extracts from req.query.teamId or req.body.teamId
   */
  getTeamId?: (req: NextApiRequest) => string | undefined;
};

/**
 * Default options for team role check
 */
const defaultOptions: Required<TeamMemberCheckOptions> = {
  getTeamId: (req) => {
    if (req.query.teamId) {
      return req.query.teamId as string;
    }

    if (req.body && req.body.teamId) {
      return req.body.teamId;
    }

    return undefined;
  },
};

/**
 * Higher-order function that wraps API handlers with team role check
 * Verifies that the current user has the specified role in the specified team
 *
 * @param handler - The API handler function
 * @param options - Configuration options for the handler
 * @returns A wrapped handler function with team role check
 */
export function withTeamMemberCheck<T = any>(
  handler: (
    req: NextApiRequest,
    res: NextApiResponse<ApiResponse<T>>,
    session?: any
  ) => Promise<void>,
  options: Partial<TeamMemberCheckOptions> = {}
) {
  const mergedOptions = { ...defaultOptions, ...options };

  return async (
    req: NextApiRequest,
    res: NextApiResponse<ApiResponse<T>>,
    session?: any
  ): Promise<void> => {
    if (!session || !session.user || !session.user.id) {
      return res.status(401).json({
        success: false,
        error: "Unauthorized. Please sign in to access this resource.",
      });
    }

    const teamId = mergedOptions.getTeamId(req);
    if (!teamId) {
      return res.status(400).json({
        success: false,
        error: "Team ID is required but was not provided",
      });
    }

    const isUserTeamMember = TeamService.isUserMemberOfTeam(
      session.user.id,
      teamId
    );

    console.log("isUserTeamMember", isUserTeamMember);

    if (!isUserTeamMember) {
      return res.status(403).json({
        success: false,
        error: "Forbidden. You are not member of this team.",
      });
    }

    await handler(req, res, session);
  };
}
