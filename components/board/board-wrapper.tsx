"use client";
import dynamic from "next/dynamic";
import { BoardContextProvider } from "@/context/boardContext";
const BoardProvider = dynamic(
  () => import("@/components/board/board-provider"),
  {
    ssr: false,
  }
); // workaround client component dynamic import to use wasm

export function BoardWrapper({
  boardId,
  docUrl,
}: {
  boardId: string;
  docUrl: string;
}) {
  return (
    <BoardContextProvider>
      <BoardProvider boardId={boardId} docUrl={docUrl} />
    </BoardContextProvider>
  );
}
