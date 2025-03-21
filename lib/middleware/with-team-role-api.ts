import { NextApiRequest, NextApiResponse } from "next";
import { ApiResponse, ApiHandlerOptions, withApiAuth } from "./with-api-auth";
import { withTeamServiceErrorHandling } from "./with-team-service-error-handling";
import {
  withTeamRoleCheck,
  TeamRoleCheckOptions,
} from "./with-team-role-check";
import { composeMiddleware, MiddlewareFunction } from "./compose";
import { withBoardServiceErrorHandling } from "./with-board-service-error-handling";

/**
 * Options for the team member API middleware
 */
export type TeamRoleApiOptions = ApiHandlerOptions & TeamRoleCheckOptions;

/**
 * Higher-order function that wraps team admin API handlers with common middleware functionality
 * - HTTP method validation
 * - Authentication check
 * - Team role check
 * - TeamService error handling
 *
 * @param handler - The API handler function
 * @param options - Configuration options for the handler
 * @returns A wrapped handler function with middleware applied
 */
export function withTeamRoleApi<T = any>(
  handler: (
    req: NextApiRequest,
    res: NextApiResponse<ApiResponse<T>>,
    session?: any
  ) => Promise<void>,
  options: Partial<TeamRoleApiOptions> = {}
) {
  const apiAuthOptions: Partial<ApiHandlerOptions> = {
    methods: options.methods,
    requireAuth: options.requireAuth,
  };

  const teamRoleCheckOptions: Partial<TeamRoleCheckOptions> = {
    getResourceId: options.getResourceId,
    resourceType: options.resourceType,
    role: options.role,
  };

  const withApiAuthOptions: MiddlewareFunction<T> = (h) =>
    withApiAuth(h, apiAuthOptions);

  const withTeamRoleCheckOptions: MiddlewareFunction<T> = (h) =>
    withTeamRoleCheck(h, teamRoleCheckOptions);

  return composeMiddleware<T>(
    withApiAuthOptions,
    withTeamRoleCheckOptions,
    withTeamServiceErrorHandling,
    withBoardServiceErrorHandling
  )(handler);
}
