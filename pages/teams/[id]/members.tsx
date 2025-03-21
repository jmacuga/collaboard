import { GetServerSideProps } from "next";
import { getTeamMembers, getTeam } from "@/db/data";
import { MembersList } from "@/components/teams/members-list";
import { getSession } from "next-auth/react";
import { TeamService } from "@/lib/services/team/team-service";
import { InviteMembersDialog } from "@/components/teams/invite-members-dialog";
import { withTeamRolePage } from "@/lib/middleware";

interface MembersPageProps {
  members: string;
  team: string;
  userRole: string;
}

export default function MembersPage({
  members,
  team,
  userRole,
}: MembersPageProps) {
  const parsedTeam = JSON.parse(team);
  const parsedMembers = JSON.parse(members);
  const parsedUserRole = JSON.parse(userRole);
  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">{parsedTeam.name} - Members </h1>
        <InviteMembersDialog />
      </div>

      {parsedMembers && <MembersList members={parsedMembers} />}
    </div>
  );
}

const getServerSidePropsFunc: GetServerSideProps = async (context) => {
  const session = await getSession(context);

  const teamId = context.params?.id as string;
  const team = await getTeam(teamId);
  const userRole = await TeamService.getUserTeamRole(session!.user.id, teamId);

  const members = await getTeamMembers(teamId);

  return {
    props: {
      members: JSON.stringify(members),
      team: JSON.stringify(team),
      userRole: JSON.stringify(userRole),
    },
  };
};

export const getServerSideProps = withTeamRolePage(getServerSidePropsFunc, {
  resourceType: "team",
  role: ["Admin", "Member"],
});
