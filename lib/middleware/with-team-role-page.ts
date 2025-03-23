import { GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import { getSession } from "next-auth/react";
import { TeamService } from "@/lib/services/team/team-service";
import { ResourceType } from "./with-team-role-check";

/**
 * Options for the team role page middleware
 */
export type TeamRolePageOptions = {
  /**
   * Function to extract the resource ID from the context
   * Default: Extracts from context.params.id
   */
  getResourceId?: (context: GetServerSidePropsContext) => string | undefined;

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

  /**
   * Redirect URL if authentication fails
   * Default: '/auth/sign-in'
   */
  authRedirect?: string;

  /**
   * Redirect URL if authorization fails
   * Default: '/teams'
   */
  forbiddenRedirect?: string;
};

/**
 * Default options for team role page middleware
 */
const defaultOptions: Required<Omit<TeamRolePageOptions, "role">> & {
  role: string;
} = {
  getResourceId: (context) => {
    return context.params?.id as string | undefined;
  },
  resourceType: "team",
  role: "Member",
  authRedirect: "/auth/sign-in",
  forbiddenRedirect: "/teams",
};

/**
 * Higher-order function that wraps getServerSideProps with team role check
 * Verifies that the current user has the specified role in the specified team
 *
 * @param getServerSidePropsFunc - The original getServerSideProps function or undefined
 * @param options - Configuration options for the middleware
 * @returns A wrapped getServerSideProps function with team role check
 */
export function withTeamRolePage<P extends { [key: string]: any } = any>(
  getServerSidePropsFunc?: (
    context: GetServerSidePropsContext
  ) => Promise<GetServerSidePropsResult<P>>,
  options: Partial<TeamRolePageOptions> = {}
) {
  const mergedOptions = { ...defaultOptions, ...options };

  return async (
    context: GetServerSidePropsContext
  ): Promise<GetServerSidePropsResult<P>> => {
    const session = await getSession(context);

    if (!session?.user?.id) {
      return {
        redirect: {
          destination: mergedOptions.authRedirect,
          permanent: false,
        },
      };
    }

    const resourceId = mergedOptions.getResourceId(context);
    if (!resourceId) {
      return {
        redirect: {
          destination: mergedOptions.forbiddenRedirect,
          permanent: false,
        },
      };
    }

    let teamId: string;

    try {
      if (mergedOptions.resourceType === "board") {
        const team = await TeamService.getTeamByBoardId(resourceId);
        if (!team) {
          return {
            redirect: {
              destination: mergedOptions.forbiddenRedirect,
              permanent: false,
            },
          };
        }
        teamId = team.id;
      } else {
        teamId = resourceId;
      }

      const userRole = await TeamService.getUserTeamRole(
        session.user.id,
        teamId
      );

      const requiredRoles = Array.isArray(mergedOptions.role)
        ? mergedOptions.role
        : [mergedOptions.role];

      const hasRequiredRole = userRole && requiredRoles.includes(userRole);

      if (!hasRequiredRole) {
        return {
          redirect: {
            destination: mergedOptions.forbiddenRedirect,
            permanent: false,
          },
        };
      }

      if (!getServerSidePropsFunc) {
        return { props: {} as P };
      }

      return await getServerSidePropsFunc(context);
    } catch (error) {
      console.error("Team role page middleware error:", error);
      return {
        redirect: {
          destination: mergedOptions.forbiddenRedirect,
          permanent: false,
        },
      };
    }
  };
}
