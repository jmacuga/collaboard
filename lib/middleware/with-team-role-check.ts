import { NextApiRequest, NextApiResponse } from "next";
import { TeamService } from "@/lib/services/team/team-service";
import { ApiResponse } from "./with-api-auth";

/**
 * Resource type for team role check
 */
export type ResourceType = "team" | "board";

/**
 * Options for the team role check middleware
 */
export type TeamRoleCheckOptions = {
  /**
   * Function to extract the resource ID from the request
   * Default: Extracts from req.query.id
   */
  getResourceId?: (req: NextApiRequest) => string | undefined;

  /**
   * The type of resource being accessed
   * Default: 'team'
   */
  resourceType?: ResourceType;

  /**
   * The role(s) that the user must have - can be a single role or an array of roles
   * If an array is provided, the user must have at least one of the specified roles
   */
  role: string | string[];
};

/**
 * Default options for team role check
 */
const defaultOptions: Required<Omit<TeamRoleCheckOptions, "role">> & {
  role: string;
} = {
  getResourceId: (req) => {
    return req.query.id as string | undefined;
  },
  resourceType: "team",
  role: "Member",
};

/**
 * Higher-order function that wraps API handlers with team role check
 * Verifies that the current user has the specified role in the specified team
 *
 * @param handler - The API handler function
 * @param options - Configuration options for the handler
 * @returns A wrapped handler function with team role check
 */
export function withTeamRoleCheck<T = any>(
  handler: (
    req: NextApiRequest,
    res: NextApiResponse<ApiResponse<T>>,
    session?: any
  ) => Promise<void>,
  options: Partial<TeamRoleCheckOptions> = {}
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

    const resourceId = mergedOptions.getResourceId(req);
    if (!resourceId) {
      return res.status(400).json({
        success: false,
        error: "Resource ID is required but was not provided",
      });
    }

    // Determine the team ID based on the resource type
    let teamId: string;

    if (mergedOptions.resourceType === "board") {
      const team = await TeamService.getTeamByBoardId(resourceId);
      if (!team) {
        return res.status(404).json({
          success: false,
          error: "Team not found for the given board",
        });
      }
      teamId = team.id;
    } else {
      teamId = resourceId;
    }

    const userRole = await TeamService.getUserTeamRole(session.user.id, teamId);
    const requiredRoles = Array.isArray(mergedOptions.role)
      ? mergedOptions.role
      : [mergedOptions.role];

    const hasRequiredRole = userRole && requiredRoles.includes(userRole);

    if (!hasRequiredRole) {
      return res.status(403).json({
        success: false,
        error: "Forbidden. You do not have the required role for this team.",
      });
    }

    await handler(req, res, session);
  };
}
