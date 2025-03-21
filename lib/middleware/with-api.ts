import { NextApiRequest, NextApiResponse } from "next";
import { ApiResponse, ApiHandlerOptions, withApiAuth } from "./with-api-auth";
import { withTeamServiceErrorHandling } from "./with-team-service-error-handling";
import { composeMiddleware, MiddlewareFunction } from "./compose";
import { withBoardServiceErrorHandling } from "./with-board-service-error-handling";

/**
 * Higher-order function that wraps team-related API handlers with common middleware functionality
 * - HTTP method validation
 * - Authentication check
 * - TeamService error handling
 *
 * @param handler - The API handler function
 * @param options - Configuration options for the handler
 * @returns A wrapped handler function with middleware applied
 */
export function withCollaboardApi<T = any>(
  handler: (
    req: NextApiRequest,
    res: NextApiResponse<ApiResponse<T>>,
    session?: any
  ) => Promise<void>,
  options: Partial<ApiHandlerOptions> = {}
) {
  const withApiAuthOptions: MiddlewareFunction<T> = (h) =>
    withApiAuth(h, options);

  return composeMiddleware<T>(
    withApiAuthOptions,
    withTeamServiceErrorHandling,
    withBoardServiceErrorHandling
  )(handler);
}
