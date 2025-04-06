import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import { TeamService } from "@/lib/services/team/team-service";
import { withTeamRolePage } from "@/lib/middleware";
import TeamBreadcrumb from "@/components/boards/breadcrumb";
import { TeamNav } from "@/components/teams/team-nav";
import TeamArchived from "@/components/teams/team-archived";
import { format } from "date-fns";
import { Clock, AlertCircle } from "lucide-react";

interface HistoryPageProps {
  logs: string;
  team: string;
  userRole: string;
}

export default function HistoryPage({
  logs,
  team,
  userRole,
}: HistoryPageProps) {
  const parsedTeam = JSON.parse(team);
  const parsedLogs = JSON.parse(logs);
  const parsedUserRole = JSON.parse(userRole);

  if (parsedTeam.archived) {
    return <TeamArchived />;
  }

  const getActionLabel = (action: string) => {
    switch (action) {
      case "CREATED":
        return "Created";
      case "DELETED":
        return "Deleted";
      default:
        return action;
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
            There are no recorded actions for this team's boards yet.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {parsedLogs.map((log: any) => (
            <div
              key={log.id}
              className="p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium">
                    <span className="text-blue-600">
                      {log.user.name} {log.user.surname}
                    </span>
                    <span className="text-gray-700">
                      {" "}
                      {getActionLabel(log.action)}{" "}
                    </span>
                    <span className="text-gray-900">
                      board "{log.board.name}"
                    </span>
                  </p>
                  <div className="flex items-center mt-1 text-sm text-gray-500">
                    <Clock className="h-3.5 w-3.5 mr-1" />
                    {format(new Date(log.createdAt), "MMM d, yyyy 'at' h:mm a")}
                  </div>
                </div>
              </div>
            </div>
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

  const logs = await TeamService.getTeamBoardLogs(teamId);

  return {
    props: {
      logs: JSON.stringify(logs),
      team: JSON.stringify(team),
      userRole: JSON.stringify(userRole),
    },
  };
};

export const getServerSideProps = withTeamRolePage(getServerSidePropsFunc, {
  resourceType: "team",
  role: ["Admin", "Member"],
});
