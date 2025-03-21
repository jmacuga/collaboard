import { NextApiRequest, NextApiResponse } from "next";
import {
  BoardServiceError,
  BoardNotFoundError,
} from "@/lib/services/board/board-service";
import { ApiResponse } from "./with-api-auth";

/**
 * Higher-order function that wraps API handlers with BoardService error handling
 *
 * @param handler - The API handler function
 * @returns A wrapped handler function with BoardService error handling
 */
export function withBoardServiceErrorHandling<T = any>(
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
      console.error("BoardService error:", error);

      if (error instanceof BoardNotFoundError) {
        return res.status(404).json({
          success: false,
          error: "Board not found",
        });
      }

      if (error instanceof BoardServiceError) {
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
