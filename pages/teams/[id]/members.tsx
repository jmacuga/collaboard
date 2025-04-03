import { GetServerSideProps } from "next";
import { MembersList } from "@/components/teams/members-list";
import { getSession } from "next-auth/react";
import { TeamService } from "@/lib/services/team/team-service";
import { InviteMembersDialog } from "@/components/teams/invite-members-dialog";
import { withTeamRolePage } from "@/lib/middleware";
import TeamBreadcrumb from "@/components/boards/breadcrumb";
import { TeamNav } from "@/components/teams/team-nav";

interface MembersPageProps {
  members: string;
  team: string;
  userRole: string;
  userId: string;
}

export default function MembersPage({
  members,
  team,
  userRole,
  userId,
}: MembersPageProps) {
  const parsedTeam = JSON.parse(team);
  const parsedMembers = JSON.parse(members);
  const parsedUserRole = JSON.parse(userRole);
  const parsedUserId = JSON.parse(userId);
  return (
    <div className="container mx-auto py-6">
      <div className="mb-8">
        <TeamBreadcrumb team={parsedTeam} />
        <h1 className="text-3xl font-bold">{parsedTeam.name} - Members </h1>
      </div>
      <div className="flex justify-between items-center mb-8">
        <TeamNav teamId={parsedTeam.id as string} />
        <InviteMembersDialog />
      </div>

      {parsedMembers && (
        <MembersList
          members={parsedMembers}
          userRole={parsedUserRole}
          teamId={parsedTeam.id}
          userId={parsedUserId}
        />
      )}
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
      members: JSON.stringify(members),
      team: JSON.stringify(team),
      userRole: JSON.stringify(userRole),
      userId: JSON.stringify(session!.user.id),
    },
  };
};

export const getServerSideProps = withTeamRolePage(getServerSidePropsFunc, {
  resourceType: "team",
  role: ["Admin", "Member"],
});
