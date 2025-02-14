import { GetServerSideProps } from "next";
import { getTeamBoards, getTeam } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { BoardCards } from "@/components/boards/board-cards";
import { getSession } from "next-auth/react";
import { IBoard } from "@/models/Board";
import { ITeam } from "@/models/Team";

interface BoardsPageProps {
  boards: IBoard[];
  team: ITeam;
}

export default function BoardsPage({ boards, team }: BoardsPageProps) {
  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">{team.name} Boards</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create Board
        </Button>
      </div>

      {boards && <BoardCards teamBoards={boards} />}
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);

  if (!session?.user) {
    return {
      redirect: {
        destination: "/auth/signin",
        permanent: false,
      },
    };
  }

  const teamId = context.params?.id as string;
  const team = await getTeam(teamId);

  if (!team) {
    return {
      notFound: true,
    };
  }

  const boards = await getTeamBoards(teamId);

  return {
    props: {
      boards,
      team,
    },
  };
};
