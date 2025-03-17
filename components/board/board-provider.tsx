"use client";
import { useEffect, useState, useRef } from "react";
import { RepoContext } from "@automerge/automerge-repo-react-hooks";
import { Repo } from "@automerge/automerge-repo";
import Board from "@/components/board/board";
import { ClientSyncService } from "@/lib/services/client-doc/client-doc-service";
import { ClientSyncContext } from "./context/client-doc-context";
import { BoardContextProvider } from "./context/board-context";
import { NetworkStatusProvider } from "@/components/providers/network-status-provider";

interface BoardState {
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
        clientSyncService,
      });
    };
    initializeClientSyncService();

    return () => {
      if (state.clientSyncService) {
        state.clientSyncService.disconnect();
      }
    };
  }, [docUrl]);

  if (!state.clientSyncService) {
    return <div>Loading board...</div>;
  }

  return (
    <NetworkStatusProvider>
      <RepoContext.Provider value={state.clientSyncService.repo}>
        <ClientSyncContext.Provider
          value={{ clientSyncService: state.clientSyncService }}
        >
          <BoardContextProvider>
            <Board />
          </BoardContextProvider>
        </ClientSyncContext.Provider>
      </RepoContext.Provider>
    </NetworkStatusProvider>
  );
}
