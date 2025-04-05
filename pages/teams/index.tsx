import { GetServerSideProps } from "next";
import { getUser } from "@/db/data";
import TeamsCards from "@/components/teams/teams-cards";
import { getSession } from "next-auth/react";
import { CreateTeamDialog } from "@/components/teams/create-team-dialog";
import { TeamService } from "@/lib/services/team/team-service";
interface TeamsPageProps {
  teams: string;
  userId: string;
}

export default function TeamsPage({ teams, userId }: TeamsPageProps) {
  const parsedTeams = JSON.parse(teams);
  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Teams</h1>
        <CreateTeamDialog />
      </div>

      <TeamsCards teams={parsedTeams} />
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);
  const user = await getUser(session!.user.email as string);
  const teams = await TeamService.getUserTeams(user!.id);
  return {
    props: {
      teams: JSON.stringify(teams),
      userId: user!.id,
    },
  };
};
