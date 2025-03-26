"use client";
import { useEffect, useState, useRef } from "react";
import { RepoContext } from "@automerge/automerge-repo-react-hooks";
import Board from "@/components/board/board";
import { ClientSyncService } from "@/lib/services/client-doc/client-doc-service";
import { ClientSyncContext } from "./context/client-doc-context";
import { BoardContextProvider } from "./context/board-context";
import { NetworkStatusProvider } from "@/components/providers/network-status-provider";
import { Team as PrismaTeam, Board as PrismaBoard } from "@prisma/client";

interface BoardState {
  clientSyncService: ClientSyncService | null;
  synced: boolean;
}

export function BoardProvider({
  board,
  team,
}: {
  board: PrismaBoard;
  team: PrismaTeam;
}) {
  const [state, setState] = useState<BoardState>({
    clientSyncService: null,
    synced: false,
  });
  const isInitialized = useRef(false);

  useEffect(() => {
    const initializeClientSyncService = async () => {
      let synced = false;
      if (isInitialized.current || state.clientSyncService) {
        return;
      }
      isInitialized.current = true;
      const clientSyncService = new ClientSyncService({
        docUrl: board.docUrl as string,
      });
      await clientSyncService.initializeRepo();
      if (await clientSyncService.canConnect()) {
        console.log("connecting");
        await clientSyncService.connect();
        synced = true;
      } else {
        console.log("Staying disconnected");
      }
      setState({
        clientSyncService,
        synced,
      });
    };
    initializeClientSyncService();

    return () => {
      if (state.clientSyncService) {
        state.clientSyncService.disconnect();
      }
    };
  }, [board.docUrl]);

  if (!state.clientSyncService) {
    return <div>Loading board...</div>;
  }

  return (
    <NetworkStatusProvider>
      <RepoContext.Provider value={state.clientSyncService.getRepo()}>
        <ClientSyncContext.Provider
          value={{ clientSyncService: state.clientSyncService }}
        >
          <BoardContextProvider syncedInitial={state.synced}>
            <Board team={team} board={board} />
          </BoardContextProvider>
        </ClientSyncContext.Provider>
      </RepoContext.Provider>
    </NetworkStatusProvider>
  );
}
