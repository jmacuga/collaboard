import { NextApiRequest, NextApiResponse } from "next";
import { ApiResponse } from "./with-api-auth";

/**
 * Type for middleware functions
 */
export type MiddlewareFunction<T = any> = (
  handler: (
    req: NextApiRequest,
    res: NextApiResponse<ApiResponse<T>>,
    session?: any
  ) => Promise<void>
) => (
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<T>>,
  session?: any
) => Promise<void>;

/**
 * Composes multiple middleware functions into a single middleware function
 * Middleware functions are applied from right to left (last to first)
 *
 * @param middlewares - Array of middleware functions to compose
 * @returns A composed middleware function
 */
export function composeMiddleware<T = any>(
  ...middlewares: MiddlewareFunction<T>[]
): MiddlewareFunction<T> {
  return (handler) => {
    return middlewares.reduceRight(
      (composed, middleware) => middleware(composed),
      handler
    );
  };
}
