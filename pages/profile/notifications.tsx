import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import { TeamService } from "@/lib/services/team/team-service";
import { AppLayout } from "@/components/layouts/app-layout";
import { TeamAction, TeamLog, Team } from "@prisma/client";
import { format } from "date-fns";
import {
  Clock,
  Bell,
  AlertCircle,
  Filter,
  CheckCircle2,
  UserPlus,
  UserMinus,
  Settings,
} from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface NotificationsPageProps {
  logs: string;
  teams: string;
}

type LogWithUser = TeamLog & {
  user: {
    id: string;
    name: string;
    email: string;
    image: string | null;
  };
  team: Team;
};

export default function NotificationsPage({
  logs,
  teams,
}: NotificationsPageProps) {
  const parsedLogs: LogWithUser[] = JSON.parse(logs);
  const parsedTeams: Team[] = JSON.parse(teams);

  const [filter, setFilter] = useState<string | null>(null);
  const [tab, setTab] = useState<string>("all");

  const displayLogs =
    tab === "all"
      ? parsedLogs
      : parsedLogs.filter((log) => {
          if (tab === "members")
            return ["MEMBER_ADDED", "MEMBER_REMOVED", "ROLE_UPDATED"].includes(
              log.action
            );
          if (tab === "boards")
            return ["BOARD_CREATED", "BOARD_DELETED"].includes(log.action);

          return false;
        });

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
    }
  };

  return (
    <div className="container mx-auto py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Notifications</h1>
        <p className="text-gray-500">
          View recent activities across your teams
        </p>
      </div>

      <div className="flex justify-between items-center mb-6">
        <Tabs value={tab} onValueChange={setTab} className="w-full max-w-md">
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="members">Members</TabsTrigger>
            <TabsTrigger value="boards">Boards</TabsTrigger>
          </TabsList>
        </Tabs>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              {filter
                ? parsedTeams.find((t) => t.id === filter)?.name
                : "All teams"}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setFilter(null)}>
              All teams
            </DropdownMenuItem>
            {parsedTeams.map((team) => (
              <DropdownMenuItem
                key={team.id}
                onClick={() => setFilter(team.id)}
              >
                {team.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {displayLogs.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-8 text-center">
            <AlertCircle className="h-16 w-16 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium">No notifications available</h3>
            <p className="text-sm text-gray-500 mt-2">
              {filter
                ? "There are no notifications for the selected team or filter"
                : "You don't have any notifications yet"}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {displayLogs.map((log) => (
            <Card key={log.id} className="hover:shadow-sm transition-shadow">
              <CardContent className="p-2">
                <div className="flex items-start gap-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">
                        {log.team.name}
                      </span>
                      <Badge
                        variant="outline"
                        className={getActionColor(log.action)}
                      >
                        {getActionIcon(log.action)}
                        <span className="ml-1 text-xs">
                          {log.action.replace(/_/g, " ")}
                        </span>
                      </Badge>
                      <span className="text-gray-500 text-xs ml-auto">
                        {format(new Date(log.createdAt), "MMM d, h:mm a")}
                      </span>
                    </div>
                    <div className="flex items-center text-xs text-gray-500">
                      <span>Author: {log.user.email}</span>
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

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: "/auth/signin",
        permanent: false,
      },
    };
  }

  try {
    const teams = await TeamService.getUserTeams(session.user.id, true);
    const logsPromises = teams.map((team) => TeamService.getTeamLogs(team.id));
    const logsArrays = await Promise.all(logsPromises);

    const allLogs = logsArrays
      .flat()
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

    const logsWithTeam = allLogs.map((log) => {
      const team = teams.find((t) => t.id === log.teamId);
      return { ...log, team };
    });

    return {
      props: {
        logs: JSON.stringify(logsWithTeam),
        teams: JSON.stringify(teams),
      },
    };
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return {
      props: {
        logs: JSON.stringify([]),
        teams: JSON.stringify([]),
        error: "Failed to load notifications",
      },
    };
  }
};
