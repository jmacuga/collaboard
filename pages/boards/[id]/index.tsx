import { GetServerSideProps } from "next";
import { getBoardById } from "@/db/data";
import { BoardProvider } from "@/components/board/board-provider";
import { hasBoardPermission } from "@/lib/auth/permission-utils";
import { getSession } from "next-auth/react";

interface BoardPageProps {
  boardId: string;
  docUrl: string;
}

export default function BoardPage({ boardId, docUrl }: BoardPageProps) {
  return <BoardProvider boardId={boardId} docUrl={docUrl} />;
}

export const getServerSideProps: GetServerSideProps = async ({
  req,
  params,
}) => {
  const boardId = params?.id as string;
  const session = await getSession({ req });

  if (!session?.user) {
    return {
      redirect: {
        destination: "/auth/login",
        permanent: false,
      },
    };
  }

  const hasPermission = await hasBoardPermission(session.user.id, boardId);

  if (!hasPermission) {
    return {
      redirect: {
        destination: "/teams",
        permanent: false,
      },
    };
  }

  const board = await getBoardById(boardId);

  return {
    props: {
      boardId,
      docUrl: board?.docUrl?.toString() || "",
    },
  };
};
