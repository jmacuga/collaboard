import { GetServerSideProps } from "next";
import { BoardService } from "@/lib/services/board/board-service";
import { BoardProvider } from "@/components/board/board-provider";
import { withTeamRolePage } from "@/lib/middleware";
import { Team } from "@prisma/client";
import { Board } from "@prisma/client";
import { TeamService } from "@/lib/services/team/team-service";

interface BoardPageProps {
  board: string;
  team: string;
}

export default function BoardPage({ board, team }: BoardPageProps) {
  const parsedBoard = JSON.parse(board);
  const parsedTeam = JSON.parse(team);
  return <BoardProvider board={parsedBoard} team={parsedTeam} />;
}

const getServerSidePropsFunc: GetServerSideProps = async ({ params }) => {
  const boardId = params?.id as string;
  const board = await BoardService.getBoardById(boardId);
  if (!board) {
    return {
      notFound: true,
    };
  }
  const team = await TeamService.getTeamById(board.teamId);
  if (!team) {
    return {
      notFound: true,
    };
  }
  return {
    props: {
      board: JSON.stringify(board),
      team: JSON.stringify(team),
    },
  };
};

export const getServerSideProps = withTeamRolePage(getServerSidePropsFunc, {
  resourceType: "board",
  role: ["Admin", "Member"],
});
