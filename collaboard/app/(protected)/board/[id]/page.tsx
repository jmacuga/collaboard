import { getBoardById } from "@/lib/data";
import Board from "@/components/board/board";
import { SocketContextProvider } from "@/context/socketContext";
import { BoardContextProvider } from "@/context/boardContext";

export default async function boardPage(
  props: {
    params: Promise<{ id: string }>;
  }
) {
  const params = await props.params;
  const board = await getBoardById(params.id);
  if (board === null) {
    return <div>board not found</div>;
  }

  return (
    <BoardContextProvider>
      <SocketContextProvider>
        <Board boardId={params.id} />
      </SocketContextProvider>
    </BoardContextProvider>
  );
}
