import { useContext, useEffect } from "react";
import { BoardContext } from "../context/board-context";
import { useNetworkStatusContext } from "@/components/providers/network-status-provider";
import { useClientSync } from "@/components/board/context/client-sync-context";
import { useRouter } from "next/router";
import { useLastViewedBoardLog } from "@/components/profile/hooks/use-last-viewed-board";
import { Board } from "@prisma/client";

type SyncModeHook = {
  toggleSyncMode: () => Promise<void>;
};

const useSyncMode = (): SyncModeHook => {
  const clientSyncService = useClientSync();
  const { isOnline, setIsOnline, setSynced } = useContext(BoardContext);
  const { networkStatus } = useNetworkStatusContext();
  const router = useRouter();
  const { updateLastViewed } = useLastViewedBoardLog();

  const getBoardId = (): string => {
    const boardId = router.query.id;
    if (!boardId || Array.isArray(boardId)) {
      throw new Error("Invalid board ID");
    }
    return boardId;
  };

  const fetchBoard = async (): Promise<Board | null> => {
    try {
      const boardId = getBoardId();
      const response = await fetch(`/api/boards/${boardId}`);

      if (!response.ok) {
        return null;
      }

      return await response.json();
    } catch (error) {
      console.error("Failed to fetch board:", error);
      return null;
    }
  };

  const isBoardArchived = async (): Promise<boolean | null> => {
    const board = await fetchBoard();
    if (!board) {
      return null;
    }
    return board.archived;
  };

  const updateBoardLastViewed = async (): Promise<void> => {
    try {
      await updateLastViewed({
        boardId: getBoardId(),
      });
    } catch (error) {
      console.error("Failed to update last viewed:", error);
    }
  };

  useEffect(() => {
    if (networkStatus !== "OFFLINE") {
      return;
    }

    const setLocalMode = async (): Promise<void> => {
      try {
        setIsOnline(false);
        await clientSyncService.setOnline(false);
      } catch (error) {
        console.error("Failed to set local mode:", error);
      }
    };

    setLocalMode();
  }, [networkStatus, clientSyncService, setIsOnline]);

  const switchToOnlineMode = async (): Promise<void> => {
    const isArchived = await isBoardArchived();

    if (isArchived) {
      router.push(`/boards/${getBoardId()}`);
      return;
    }

    const canConnect = await clientSyncService.canConnect();
    if (!canConnect) {
      setSynced(false);
      console.log("Detected local changes - staying disconnected");
      return;
    }

    await clientSyncService.setOnline(true);
    setIsOnline(true);
    await updateBoardLastViewed();
  };

  const switchToOfflineMode = async (): Promise<void> => {
    await updateBoardLastViewed();
    await clientSyncService.setOnline(false);
    setIsOnline(false);
  };

  const toggleSyncMode = async (): Promise<void> => {
    try {
      if (!isOnline && networkStatus !== "ONLINE") {
        console.warn("Cannot switch to real-time mode when network is offline");
        return;
      }

      if (!isOnline) {
        await switchToOnlineMode();
      } else {
        await switchToOfflineMode();
      }
    } catch (error) {
      console.error("Failed to toggle real-time/local mode:", error);
    }
  };

  return { toggleSyncMode };
};

export default useSyncMode;
