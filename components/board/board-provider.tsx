"use client";
import { useEffect, useState, useRef } from "react";
import { RepoContext } from "@automerge/automerge-repo-react-hooks";
import Board from "@/components/board/board";
import { ClientSyncService } from "@/lib/services/client-doc/client-sync-service";
import { ClientSyncContext } from "./context/client-sync-context";
import { BoardContextProvider } from "./context/board-context";
import { NetworkStatusProvider } from "@/components/providers/network-status-provider";
import { Team as PrismaTeam, Board as PrismaBoard } from "@prisma/client";
import { SyncStatusControl } from "./components/sync-status-control";
import { BoardHeader } from "./components/board-header";
import { useUpdateLastViewed } from "@/components/profile/hooks/user-last-viewed";
import { UserLastViewedLogType } from "@prisma/client";
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
  const { updateLastViewed } = useUpdateLastViewed();

  useEffect(() => {
    const initializeClientSyncService = async () => {
      let synced = false;
      if (isInitialized.current || state.clientSyncService) {
        return;
      }
      isInitialized.current = true;
      const clientSyncService = new ClientSyncService({
        docId: board.automergeDocId as string,
      });
      await clientSyncService.initializeRepo();
      if (await clientSyncService.canConnect()) {
        await clientSyncService.connect();
        await updateLastViewed({
          type: UserLastViewedLogType.BOARD,
          boardId: board.id,
        });
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
      (async () => {
        if (state.clientSyncService) {
          if (state.clientSyncService.isConnected()) {
            await updateLastViewed({
              type: UserLastViewedLogType.BOARD,
              boardId: board.id,
            });
            await state.clientSyncService.disconnect();
          }
        }
      })();
    };
  }, [
    board.automergeDocId,
    board.id,
    state.clientSyncService,
    updateLastViewed,
  ]);

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
            <div className="flex flex-col h-screen">
              <BoardHeader
                boardName={board.name}
                teamName={team.name}
                teamId={team.id}
              />
              <Board team={team} board={board} />
              <div className="fixed bottom-6 right-6 z-40 flex items-center gap-3">
                <SyncStatusControl />
              </div>
            </div>
          </BoardContextProvider>
        </ClientSyncContext.Provider>
      </RepoContext.Provider>
    </NetworkStatusProvider>
  );
}
