import { GetServerSideProps } from "next";
import { BoardService } from "@/lib/services/board/board-service";
import { BoardProvider } from "@/components/board/board-provider";
import { withTeamRolePage } from "@/lib/middleware";

interface BoardPageProps {
  boardId: string;
  docUrl: string;
}

export default function BoardPage({ boardId, docUrl }: BoardPageProps) {
  return <BoardProvider boardId={boardId} docUrl={docUrl} />;
}

const getServerSidePropsFunc: GetServerSideProps = async ({ params }) => {
  const boardId = params?.id as string;
  const board = await BoardService.getBoardById(boardId);

  return {
    props: {
      boardId,
      docUrl: board?.docUrl?.toString() || "",
    },
  };
};

export const getServerSideProps = withTeamRolePage(getServerSidePropsFunc, {
  resourceType: "board",
  role: ["Admin", "Member"],
});
