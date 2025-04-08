import { useContext, useEffect } from "react";
import { BoardContext } from "../context/board-context";
import { useNetworkStatusContext } from "@/components/providers/network-status-provider";
import { useClientSync } from "@/components/board/context/client-sync-context";
import { useRouter } from "next/router";
import { useUpdateLastViewed } from "@/components/profile/hooks/user-last-viewed";
import { UserLastViewedLogType } from "@prisma/client";

const useSyncMode = () => {
  const clientSyncService = useClientSync();
  const { isOnline, setIsOnline, setSynced } = useContext(BoardContext);
  const { networkStatus } = useNetworkStatusContext();
  const router = useRouter();
  const { updateLastViewed } = useUpdateLastViewed();

  const fetchBoard = async () => {
    try {
      const boardId = router.query.id as string;
      const response = await fetch(`/api/boards/${boardId}`);
      if (!response.ok) {
        return null;
      }
      const board = await response.json();
      return board;
    } catch (error) {
      console.error("Failed to fetch board:", error);
    }
  };

  const boardArchived = async () => {
    const board = await fetchBoard();
    if (!board) {
      return null;
    }
    return board.archived;
  };

  useEffect(() => {
    if (networkStatus === "OFFLINE") {
      setIsOnline(false);
      const setLocalMode = async () => {
        try {
          await clientSyncService.setOnline(false);
        } catch (error: unknown) {
          console.error("Failed to set local mode:", error);
        }
      };
      setLocalMode();
    }
  }, [networkStatus, clientSyncService]);

  const toggleSyncMode = async () => {
    try {
      if (!isOnline && networkStatus !== "ONLINE") {
        console.warn("Cannot switch to real-time mode when network is offline");
        return;
      }
      if (!isOnline) {
        if (await boardArchived()) {
          const boardId = router.query.id as string;
          router.push(`/boards/${boardId}`);
        }
        if (await clientSyncService.canConnect()) {
          await clientSyncService.setOnline(true);
          setIsOnline(true);
          await updateLastViewed({
            type: UserLastViewedLogType.BOARD,
            boardId: router.query.id as string,
          });
        } else {
          setSynced(false);
          console.log("Detected local changes - staying offline");
        }
      } else {
        await updateLastViewed({
          type: UserLastViewedLogType.BOARD,
          boardId: router.query.id as string,
        });
        await clientSyncService.setOnline(false);
        setIsOnline(false);
      }
    } catch (error) {
      console.error("Failed to toggle real-time/local mode:", error);
    }
  };
  return { toggleSyncMode };
};

export default useSyncMode;
