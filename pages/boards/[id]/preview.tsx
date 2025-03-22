import { GetServerSideProps } from "next";
import { BoardService } from "@/lib/services/board/board-service";

interface BoardPageProps {
  boardId: string;
  docUrl: string;
}

export default function BoardPage({ boardId, docUrl }: BoardPageProps) {
  return <h1>Board {boardId} preview</h1>;
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const boardId = params?.id as string;
  const board = await BoardService.getBoardById(boardId);

  if (!board || !board.docUrl) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      boardId,
      docUrl: board.docUrl.toString(),
    },
  };
};
