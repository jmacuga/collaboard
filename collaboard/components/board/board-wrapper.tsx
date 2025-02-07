"use client";
import dynamic from "next/dynamic";
import { BoardContextProvider } from "@/context/boardContext";
const BoardWrapper = dynamic(
  () => import("@/components/board/board-provider"),
  {
    ssr: false,
  }
); // workaround client component dynamic import to use wasm
import { useEffect } from "react";
import connectWebSocket from "@/lib/websocket";

export function BoardPage({ docUrl }: { docUrl: string }) {
  useEffect(() => {
    const ws = connectWebSocket();

    return () => {
      ws.close();
    };
  }, []);

  return (
    <BoardContextProvider>
      <BoardWrapper docUrl={docUrl} />
    </BoardContextProvider>
  );
}
