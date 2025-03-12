import { GetServerSideProps } from "next";
import { getTeamBoards, getTeam } from "@/db/data";
import { BoardCards } from "@/components/boards/board-cards";
import { getSession } from "next-auth/react";
import { CreateBoardDialog } from "@/components/boards/create-board-dialog";

interface BoardsPageProps {
  boards: string;
  team: string;
}

export default function BoardsPage({ boards, team }: BoardsPageProps) {
  const parsedBoards = JSON.parse(boards);
  const parsedTeam = JSON.parse(team);
  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">{parsedTeam.name} Boards</h1>
        <CreateBoardDialog teamId={parsedTeam.id as string} />
      </div>

      {parsedBoards && <BoardCards teamBoards={parsedBoards} />}
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
      boards: JSON.stringify(boards),
      team: JSON.stringify(team),
    },
  };
};
