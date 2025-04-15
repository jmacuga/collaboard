import { useContext } from "react";
import { BoardContext } from "../context/board-context";
import { useRouter } from "next/router";
import { useLastViewedBoardLog } from "@/components/profile/hooks/use-last-viewed-board";
import { useConnectionManager } from "./use-connection-manager";
import { useNetworkStatusContext } from "@/components/providers/network-status-provider";
import { toast } from "sonner";
import { useBoardArchivedCheck } from "./use-board-archived-check";

type SyncModeHook = {
  toggleSyncMode: () => Promise<void>;
};

const useSyncMode = (): SyncModeHook => {
  const { isRealTime, setIsRealTime, setSynced } = useContext(BoardContext);
  const { networkStatus } = useNetworkStatusContext();
  const { switchToOnline, switchToOffline } = useConnectionManager();
  const { updateLastViewed } = useLastViewedBoardLog();
  const router = useRouter();
  const { isBoardArchived } = useBoardArchivedCheck();

  const updateBoardLastViewed = async (): Promise<void> => {
    try {
      await updateLastViewed({
        boardId: router.query.id as string,
      });
    } catch (error) {
      console.error("Failed to update last viewed:", error);
    }
  };

  const toggleSyncMode = async (): Promise<void> => {
    try {
      if (!isRealTime && networkStatus !== "ONLINE") {
        toast.warning(
          "Cannot switch to real-time mode when network is offline"
        );
        return;
      }

      if (!isRealTime) {
        const isArchived = await isBoardArchived();
        if (isArchived) {
          router.push(`/boards/${router.query.id}`);
          toast.error("Board is archived");
          return;
        }
        const connected = await switchToOnline();

        if (connected) {
          setIsRealTime(true);
          await updateBoardLastViewed();
          setSynced(true);
        } else {
          setSynced(false);
        }
      } else {
        await updateBoardLastViewed();
        await switchToOffline();
        setIsRealTime(false);
      }
    } catch (error) {
      toast.error("Failed to toggle real-time/local mode");
    }
  };

  return { toggleSyncMode };
};

export default useSyncMode;
