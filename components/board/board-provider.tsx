"use client";
import { useEffect, useState, useRef } from "react";
import { RepoContext } from "@automerge/automerge-repo-react-hooks";
import { Repo } from "@automerge/automerge-repo";
import Board from "@/components/board/board";
import { ClientSyncService } from "@/lib/services/client-doc/client-doc-service";
import { ClientSyncContext } from "./context/client-doc-context";
import { BoardContextProvider } from "./context/board-context";
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
  const isInitialized = useRef(false);

  useEffect(() => {
    const initializeClientSyncService = async () => {
      if (isInitialized.current || state.clientSyncService) {
        return;
      }
      isInitialized.current = true;
      const clientSyncService = new ClientSyncService({ docUrl });
      await clientSyncService.initializeRepo();
      if (clientSyncService.canConnect()) {
        await clientSyncService.connect();
      }
      setState({
        repo: clientSyncService.localRepo,
        clientSyncService,
        docUrl: clientSyncService.getDocUrl(),
      });
    };
    initializeClientSyncService();
  }, [docUrl]);

  if (!state.repo || !state.clientSyncService) {
    return <div>Loading board...</div>;
  }

  return (
    <RepoContext.Provider value={state.repo}>
      <ClientSyncContext.Provider
        value={{ clientSyncService: state.clientSyncService }}
      >
        <BoardContextProvider>
          <Board />
        </BoardContextProvider>
      </ClientSyncContext.Provider>
    </RepoContext.Provider>
  );
}
