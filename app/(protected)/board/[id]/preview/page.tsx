import { getBoardById } from "@/lib/data";
import { BoardWrapper } from "@/components/board/board-wrapper";

export default async function boardPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: boardId } = await params;
  const board = await getBoardById(boardId);

  if (!board) {
    console.error("Board not found");
    return <div>Board not found</div>;
  }

  const docUrl = board.docUrl?.toString() || "";

  return <BoardWrapper boardId={boardId} docUrl={docUrl} />;
}
