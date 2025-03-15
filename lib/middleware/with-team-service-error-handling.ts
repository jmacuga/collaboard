import { NextApiRequest, NextApiResponse } from "next";
import {
  TeamServiceError,
  InvitationNotFoundError,
  InvitationNotPendingError,
  TeamNotFoundError,
  UserAlreadyTeamMemberError,
  UserNotFoundError,
  RoleNotFoundError,
} from "@/lib/services/team/team-service";
import { ApiResponse } from "./with-api-auth";

/**
 * Higher-order function that wraps API handlers with TeamService error handling
 *
 * @param handler - The API handler function
 * @returns A wrapped handler function with TeamService error handling
 */
export function withTeamServiceErrorHandling<T = any>(
  handler: (
    req: NextApiRequest,
    res: NextApiResponse<ApiResponse<T>>,
    session?: any
  ) => Promise<void>
) {
  return async (
    req: NextApiRequest,
    res: NextApiResponse<ApiResponse<T>>,
    session?: any
  ): Promise<void> => {
    try {
      await handler(req, res, session);
    } catch (error) {
      console.error("TeamService error:", error);

      if (error instanceof InvitationNotFoundError) {
        return res.status(404).json({
          success: false,
          error: "Invitation not found",
        });
      }

      if (error instanceof InvitationNotPendingError) {
        return res.status(400).json({
          success: false,
          error: "Invitation is not pending",
        });
      }

      if (error instanceof TeamNotFoundError) {
        return res.status(404).json({
          success: false,
          error: "Team not found",
        });
      }

      if (error instanceof UserAlreadyTeamMemberError) {
        return res.status(400).json({
          success: false,
          error: "User is already a member of this team",
        });
      }

      if (error instanceof UserNotFoundError) {
        return res.status(404).json({
          success: false,
          error: "User not found",
        });
      }

      if (error instanceof RoleNotFoundError) {
        return res.status(500).json({
          success: false,
          error: "Role not found",
        });
      }

      if (error instanceof TeamServiceError) {
        return res.status(400).json({
          success: false,
          error: error.message,
        });
      }

      console.error("Unexpected error:", error);
      return res.status(500).json({
        success: false,
        error: "An unexpected error occurred",
      });
    }
  };
}
