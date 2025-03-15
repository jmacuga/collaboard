import { NextApiRequest, NextApiResponse } from "next";
import { ApiResponse, ApiHandlerOptions, withApiAuth } from "./with-api-auth";
import { withTeamServiceErrorHandling } from "./with-team-service-error-handling";
import {
  withTeamMemberCheck,
  TeamMemberCheckOptions,
} from "./with-team-member-check";
import { composeMiddleware, MiddlewareFunction } from "./compose";

/**
 * Options for the team member API middleware
 */
export type TeamMemberApiOptions = ApiHandlerOptions & TeamMemberCheckOptions;

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
export function withTeamMemberApi<T = any>(
  handler: (
    req: NextApiRequest,
    res: NextApiResponse<ApiResponse<T>>,
    session?: any
  ) => Promise<void>,
  options: Partial<TeamMemberApiOptions> = {}
) {
  const apiAuthOptions: Partial<ApiHandlerOptions> = {
    methods: options.methods,
    requireAuth: options.requireAuth,
  };

  const teamMemberCheckOptions: Partial<TeamMemberCheckOptions> = {
    getTeamId: options.getTeamId,
  };

  const withApiAuthOptions: MiddlewareFunction<T> = (h) =>
    withApiAuth(h, apiAuthOptions);

  const withTeamMemberCheckOptions: MiddlewareFunction<T> = (h) =>
    withTeamMemberCheck(h, teamMemberCheckOptions);

  return composeMiddleware<T>(
    withApiAuthOptions,
    withTeamMemberCheckOptions,
    withTeamServiceErrorHandling
  )(handler);
}
