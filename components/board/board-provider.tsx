"use client";
import { useEffect, useState } from "react";
import { RepoContext } from "@automerge/automerge-repo-react-hooks";
import { Repo } from "@automerge/automerge-repo";
import Board from "@/components/board/board";
import { ClientDocService } from "@/lib/services/client-doc/client-doc-service";
import { ClientDocContext } from "./context/client-doc-context";

interface BoardState {
  repo: Repo | null;
  docUrl: string;
  clientDocService: ClientDocService | null;
}

export function BoardProvider({
  boardId,
  docUrl,
}: {
  boardId: string;
  docUrl: string;
}) {
  const [state, setState] = useState<BoardState>({
    repo: null,
    docUrl: docUrl || "",
    clientDocService: null,
  });

  useEffect(() => {
    const initializeBoard = async () => {
      const clientDocService = await ClientDocService.create(docUrl);
      if (clientDocService.canConnect()) {
        clientDocService.connect();
      }
      setState({
        repo: clientDocService.localRepo,
        clientDocService,
        docUrl: clientDocService.getDocUrl(),
      });
    };
    initializeBoard();
  }, [docUrl]);

  if (!state.repo || !state.clientDocService) {
    return <div>Loading board...</div>;
  }

  return (
    <RepoContext.Provider value={state.repo}>
      <ClientDocContext.Provider
        value={{ clientDocService: state.clientDocService }}
      >
        <Board />
      </ClientDocContext.Provider>
    </RepoContext.Provider>
  );
}
