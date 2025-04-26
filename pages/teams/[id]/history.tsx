import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import { TeamService } from "@/lib/services/team/team-service";
import { withTeamRolePage } from "@/lib/middleware";
import TeamBreadcrumb from "@/components/boards/breadcrumb";
import { TeamNav } from "@/components/teams/team-nav";
import TeamArchived from "@/components/teams/team-archived";
import { format } from "date-fns";
import {
  AlertCircle,
  UserPlus,
  UserMinus,
  Settings,
  CheckCircle2,
  Bell,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { TeamAction } from "@prisma/client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLastViewedTeamLog } from "@/components/profile/hooks/use-last-viewed-team";
import { LastViewedTeamLogService } from "@/lib/services/last-viewed-team-log/last-viewed-team-log-service";

interface HistoryPageProps {
  logs: string;
  team: string;
  userRole: string;
  lastViewedAt: string | null;
}

export default function HistoryPage({
  logs,
  team,
  lastViewedAt,
}: HistoryPageProps) {
  const parsedTeam = JSON.parse(team);
  const parsedLogs = JSON.parse(logs);
  const lastViewed = lastViewedAt ? new Date(lastViewedAt) : null;
  const mountedRef = useRef(false);
  const { updateLastViewed } = useLastViewedTeamLog();
  useEffect(() => {
    if (!mountedRef.current) {
      mountedRef.current = true;
      updateLastViewed({
        teamId: parsedTeam.id,
      });
    }
  }, [parsedTeam.id]);

  if (parsedTeam.archived) {
    return <TeamArchived />;
  }

  const getActionLabel = (action: TeamAction) => {
    switch (action) {
      case "CREATED":
        return "Created team";
      case "DELETED":
        return "Deleted team";
      case "MEMBER_ADDED":
        return "Added member";
      case "MEMBER_REMOVED":
        return "Removed member";
      case "ROLE_UPDATED":
        return "Updated role";
      case "BOARD_CREATED":
        return "Created board";
      case "BOARD_DELETED":
        return "Deleted board";
      case "MERGE_REQUEST_CREATED":
        return "Created merge request";
      case "MERGE_REQUEST_UPDATED":
        return "Updated merge request";
      case "REVIEW_REQUEST_CREATED":
        return "Created review request";
      case "REVIEW_REQUEST_UPDATED":
        return "Updated review request";

      default:
        return action;
    }
  };

  const getActionIcon = (action: TeamAction) => {
    switch (action) {
      case "MEMBER_ADDED":
        return <UserPlus className="h-4 w-4" />;
      case "MEMBER_REMOVED":
        return <UserMinus className="h-4 w-4" />;
      case "ROLE_UPDATED":
        return <Settings className="h-4 w-4" />;
      case "BOARD_CREATED":
      case "BOARD_DELETED":
        return <CheckCircle2 className="h-4 w-4" />;
      case "MERGE_REQUEST_CREATED":
      case "MERGE_REQUEST_UPDATED":
      case "REVIEW_REQUEST_CREATED":
      case "REVIEW_REQUEST_UPDATED":
        return <Bell className="h-4 w-4" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const getActionColor = (action: TeamAction) => {
    switch (action) {
      case "MEMBER_ADDED":
        return "bg-green-100 text-green-800 px-2 py-1 rounded-md";
      case "MEMBER_REMOVED":
        return "bg-red-100 text-red-800 px-2 py-1 rounded-md";
      case "ROLE_UPDATED":
        return "bg-yellow-100 text-yellow-800 px-2 py-1 rounded-md";
      case "BOARD_CREATED":
        return "bg-blue-100 text-blue-800 px-2 py-1 rounded-md";
      case "BOARD_DELETED":
        return "bg-red-100 text-red-800 px-2 py-1 rounded-md";
      case "MERGE_REQUEST_CREATED":
      case "MERGE_REQUEST_UPDATED":
      case "REVIEW_REQUEST_CREATED":
      case "REVIEW_REQUEST_UPDATED":
        return "bg-purple-100 text-purple-800 px-2 py-1 rounded-md";
      default:
        return "bg-gray-100 text-gray-800 px-2 py-1 rounded-md";
    }
  };

  return (
    <div className="container mx-auto py-6">
      <div className="mb-8">
        <TeamBreadcrumb team={parsedTeam} />
        <h1 className="text-3xl font-bold">{parsedTeam.name} - History</h1>
      </div>
      <div className="flex justify-between items-center mb-8">
        <TeamNav teamId={parsedTeam.id as string} />
      </div>

      {parsedLogs.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <AlertCircle className="h-16 w-16 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium">No history available</h3>
          <p className="text-sm text-gray-500 mt-2">
            There are no recorded actions for this team yet.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {parsedLogs.map((log: any) => (
            <Card
              key={log.id}
              className={`hover:shadow-sm transition-shadow ${
                lastViewed && new Date(log.createdAt) > lastViewed
                  ? "border-l-4 border-l-blue-500"
                  : ""
              }`}
            >
              <CardContent className="p-2">
                <div className="flex items-start gap-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className={getActionColor(log.action)}
                      >
                        {getActionIcon(log.action)}
                        <span className="ml-1 text-xs">
                          {getActionLabel(log.action)}
                        </span>
                      </Badge>
                      {lastViewed && new Date(log.createdAt) > lastViewed && (
                        <Badge className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md">
                          New
                        </Badge>
                      )}
                      <span className="text-gray-500 text-xs ml-auto">
                        {format(new Date(log.createdAt), "MMM d, h:mm a")}
                      </span>
                    </div>
                    <div className="flex items-center text-xs text-gray-500">
                      <span>
                        Author: {log.user.name} {log.user.surname}
                      </span>
                    </div>
                    <p className="text-sm mt-1">{log.message}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

const getServerSidePropsFunc: GetServerSideProps = async (context) => {
  const session = await getSession(context);

  const teamId = context.params?.id as string;
  const userRole = await TeamService.getUserTeamRole(session!.user.id, teamId);

  const team = await TeamService.getTeamById(teamId);

  if (!team) {
    return {
      notFound: true,
    };
  }

  const logs = await TeamService.getTeamLogs(teamId);

  const lastViewedAt = await LastViewedTeamLogService.getTimestamp(
    session!.user.id,
    teamId
  );

  return {
    props: {
      logs: JSON.stringify(logs),
      team: JSON.stringify(team),
      userRole: JSON.stringify(userRole),
      lastViewedAt: lastViewedAt ? lastViewedAt.toISOString() : null,
    },
  };
};

export const getServerSideProps = withTeamRolePage(getServerSidePropsFunc, {
  resourceType: "team",
  role: ["Admin", "Member"],
});
