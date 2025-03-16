import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth/auth";

/**
 * API response type for all API endpoints
 */
export type ApiResponse<T = any> = {
  success: boolean;
  message?: string;
  error?: string;
  data?: T;
};

/**
 * Configuration options for the API handler
 */
export type ApiHandlerOptions = {
  methods: string[];
  requireAuth: boolean;
};

/**
 * Default options for API handlers
 */
const defaultOptions: ApiHandlerOptions = {
  methods: ["GET"],
  requireAuth: true,
};

/**
 * Higher-order function that wraps API handlers with common middleware functionality
 * - HTTP method validation
 * - Authentication check
 * - Consistent error handling
 *
 * @param handler - The API handler function
 * @param options - Configuration options for the handler
 * @returns A wrapped handler function with middleware applied
 */
export function withApiAuth<T = any>(
  handler: (
    req: NextApiRequest,
    res: NextApiResponse<ApiResponse<T>>,
    session?: any
  ) => Promise<void>,
  options: Partial<ApiHandlerOptions> = {}
) {
  const mergedOptions = { ...defaultOptions, ...options };

  return async (
    req: NextApiRequest,
    res: NextApiResponse<ApiResponse<T>>
  ): Promise<void> => {
    if (!mergedOptions.methods.includes(req.method || "")) {
      return res.status(405).json({
        success: false,
        error: `Method not allowed. Use ${mergedOptions.methods.join(
          ", "
        )} instead.`,
      });
    }

    let session = null;
    if (mergedOptions.requireAuth) {
      session = await getServerSession(req, res, authOptions);
      if (!session) {
        return res.status(401).json({
          success: false,
          error: "Unauthorized. Please sign in to access this resource.",
        });
      }
    }

    try {
      await handler(req, res, session);
    } catch (error) {
      console.error("API error:", error);

      if (error instanceof Error) {
        return res.status(400).json({
          success: false,
          error: error.message,
        });
      }

      return res.status(500).json({
        success: false,
        error: "An unexpected error occurred",
      });
    }
  };
}
