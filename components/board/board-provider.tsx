"use client";
import { useEffect, useState } from "react";
import { RepoContext } from "@automerge/automerge-repo-react-hooks";
import { Repo } from "@automerge/automerge-repo";
import Board from "@/components/board/board";
import { ClientSyncService } from "@/lib/services/client-doc/client-doc-service";
import { ClientSyncContext } from "./context/client-doc-context";

interface BoardState {
  repo: Repo | null;
  docUrl: string;
  clientSyncService: ClientSyncService | null;
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
    clientSyncService: null,
  });

  useEffect(() => {
    const initializeBoard = async () => {
      const clientSyncService = await ClientSyncService.create(docUrl);
      if (clientSyncService.canConnect()) {
        clientSyncService.connect();
      }
      setState({
        repo: clientSyncService.localRepo,
        clientSyncService,
        docUrl: clientSyncService.getDocUrl(),
      });
    };
    initializeBoard();
  }, [docUrl]);

  if (!state.repo || !state.clientSyncService) {
    return <div>Loading board...</div>;
  }

  return (
    <RepoContext.Provider value={state.repo}>
      <ClientSyncContext.Provider
        value={{ clientSyncService: state.clientSyncService }}
      >
        <Board />
      </ClientSyncContext.Provider>
    </RepoContext.Provider>
  );
}
