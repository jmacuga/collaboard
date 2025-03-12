import { GetServerSideProps } from "next";
import { getUser, getUserTeams } from "@/db/data";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import TeamsCards from "@/components/teams/teams-cards";
import { getSession } from "next-auth/react";
import { CreateTeamDialog } from "@/components/teams/create-team-dialog";
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

  if (!session?.user?.email) {
    return {
      redirect: {
        destination: "/auth/login",
        permanent: false,
      },
    };
  }

  const user = await getUser(session.user.email);

  if (!user) {
    return {
      redirect: {
        destination: "/auth/login",
        permanent: false,
      },
    };
  }

  const teams = await getUserTeams(user.id);
  console.log("user.id", user.email);
  return {
    props: {
      teams: JSON.stringify(teams),
      userId: user.id,
    },
  };
};
