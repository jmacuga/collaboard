import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import { TeamService } from "@/lib/services/team/team-service";
import { withTeamRolePage } from "@/lib/middleware";
import { LeaveTeamDialog } from "@/components/teams/leave-team-dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { TeamNav } from "@/components/teams/team-nav";
import TeamBreadcrumb from "@/components/boards/breadcrumb";
import TeamArchived from "@/components/teams/team-archived";

interface SettingsPageProps {
  team: string;
  userRole: string;
  members: string;
}

export default function SettingsPage({
  team,
  userRole,
  members,
}: SettingsPageProps) {
  const parsedTeam = JSON.parse(team);
  const parsedUserRole = JSON.parse(userRole);
  const parsedMembers = JSON.parse(members);

  const isAdmin = parsedUserRole === "Admin";
  const adminsCount = parsedMembers.filter(
    (member: any) => member.role.name === "Admin"
  ).length;
  if (parsedTeam.archived) {
    return <TeamArchived />;
  }

  return (
    <div className="container mx-auto py-6">
      <div className="mb-8">
        <TeamBreadcrumb team={parsedTeam} />
        <h1 className="text-3xl font-bold">{parsedTeam.name} - Settings </h1>
      </div>
      <div className="flex justify-between items-center mb-8">
        <TeamNav teamId={parsedTeam.id as string} />
      </div>
      <div className="space-y-6">
        <Card>
          <CardContent>
            <div className="space-y-4">
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium">Leave Team</h3>
                  <p className="text-sm text-muted-foreground">
                    {adminsCount === 1 && isAdmin
                      ? "You are the only admin of this team. You cannot leave the team."
                      : "Remove yourself from this team"}
                  </p>
                </div>
                {!(adminsCount === 1 && isAdmin) && (
                  <LeaveTeamDialog
                    teamId={parsedTeam.id}
                    teamName={parsedTeam.name}
                  />
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

const getServerSidePropsFunc: GetServerSideProps = async (context) => {
  const session = await getSession(context);

  const teamId = context.params?.id as string;
  const team = await TeamService.getTeamById(teamId);
  const userRole = await TeamService.getUserTeamRole(session!.user.id, teamId);
  const members = await TeamService.getTeamMembers(teamId);

  return {
    props: {
      team: JSON.stringify(team),
      userRole: JSON.stringify(userRole),
      members: JSON.stringify(members),
    },
  };
};

export const getServerSideProps = withTeamRolePage(getServerSidePropsFunc, {
  resourceType: "team",
  role: ["Admin", "Member"],
});
