"use client";
import { useEffect, useState, useRef } from "react";
import { RepoContext } from "@automerge/automerge-repo-react-hooks";
import Board from "@/components/board/board";
import { CollaborationClient } from "@/lib/sync/collaboration-client";
import { CollaborationClientContext } from "./context/collaboration-client-context";
import { BoardContextProvider } from "./context/board-context";
import { NetworkStatusProvider } from "@/components/providers/network-status-provider";
import { Team as PrismaTeam, Board as PrismaBoard } from "@prisma/client";
import { SyncStatusControl } from "./components/sync-status-control";
import { BoardHeader } from "./components/board-header";
import { useLastViewedBoardLog } from "@/components/profile/hooks/use-last-viewed-board";
import { NEXT_PUBLIC_WEBSOCKET_URL } from "@/lib/constants";
import { useSession } from "next-auth/react";
import { PeerId } from "@automerge/automerge-repo";
interface BoardState {
  collaborationClient: CollaborationClient | null;
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
    collaborationClient: null,
    synced: false,
  });
  const isInitialized = useRef(false);
  const { updateLastViewed } = useLastViewedBoardLog();
  const session = useSession();

  const userId = session.data?.user?.id;

  useEffect(() => {
    const initializeCollaborationClient = async () => {
      let synced = false;
      if (isInitialized.current || state.collaborationClient) {
        return;
      }
      isInitialized.current = true;
      const collaborationClient = new CollaborationClient(
        board.automergeDocId as string,
        NEXT_PUBLIC_WEBSOCKET_URL,
        userId as PeerId
      );
      await collaborationClient.initialize();
      if (await collaborationClient.canConnect()) {
        await collaborationClient.connect();
        await updateLastViewed({
          boardId: board.id,
        });
        synced = true;
      } else {
        console.log("Staying disconnected");
      }
      setState({
        collaborationClient,
        synced,
      });
    };
    initializeCollaborationClient();
    return () => {
      (async () => {
        if (state.collaborationClient) {
          if (state.collaborationClient.isConnected()) {
            await updateLastViewed({
              boardId: board.id,
            });
            await state.collaborationClient.disconnect();
          }
        }
      })();
    };
  }, [
    board.automergeDocId,
    board.id,
    state.collaborationClient,
    updateLastViewed,
  ]);

  if (!state.collaborationClient) {
    return <div>Loading board...</div>;
  }

  return (
    <NetworkStatusProvider>
      <RepoContext.Provider value={state.collaborationClient.getRepo()}>
        <CollaborationClientContext.Provider
          value={{ collaborationClient: state.collaborationClient }}
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
        </CollaborationClientContext.Provider>
      </RepoContext.Provider>
    </NetworkStatusProvider>
  );
}
