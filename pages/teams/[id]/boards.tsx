import { GetServerSideProps } from "next";
import { getTeamBoards, getTeam } from "@/db/data";
import { BoardCards } from "@/components/boards/board-cards";
import { getSession } from "next-auth/react";
import { IBoard } from "@/db/models/Board";
import { ITeam } from "@/db/models/Team";
import { CreateBoardDialog } from "@/components/boards/create-board-dialog";

interface BoardsPageProps {
  boards: IBoard[];
  team: ITeam;
}

export default function BoardsPage({ boards, team }: BoardsPageProps) {
  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">{team.name} Boards</h1>
        <CreateBoardDialog teamId={team._id as string} />
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
