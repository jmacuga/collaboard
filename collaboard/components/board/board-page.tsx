"use client";
import dynamic from "next/dynamic";
import { BoardContextProvider } from "@/context/boardContext";
const BoardWrapper = dynamic(() => import("@/components/board/board-wrapper"), {
  ssr: false,
}); // workaround client component dynamic import to use wasm

export function BoardPage({ docUrl }: { docUrl: string }) {
  return (
    <BoardContextProvider>
      <BoardWrapper docUrl={docUrl} />
    </BoardContextProvider>
  );
}
