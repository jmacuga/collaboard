import { GetServerSideProps } from "next";

import { getBoardById } from "@/db/data";
import { BoardContextProvider } from "@/components/board/context/board-context";
import { BoardProvider } from "@/components/board/board-provider";

interface BoardPageProps {
  boardId: string;
  docUrl: string;
}

export default function BoardPage({ boardId, docUrl }: BoardPageProps) {
  return <BoardProvider boardId={boardId} docUrl={docUrl} />;
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const boardId = params?.id as string;
  const board = await getBoardById(boardId);

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
