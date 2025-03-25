import { useContext, useEffect } from "react";
import { BoardContext } from "../context/board-context";
import { useNetworkStatusContext } from "@/components/providers/network-status-provider";
import { useClientSync } from "@/components/board/context/client-doc-context";

const useSyncMode = () => {
  const clientSyncService = useClientSync();
  const { isOnline, setIsOnline, setSynced } = useContext(BoardContext);
  const { networkStatus } = useNetworkStatusContext();

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
        if (await clientSyncService.canConnect()) {
          await clientSyncService.setOnline(true);
          setIsOnline(true);
        } else {
          setSynced(false);
          console.log("Detected local changes - staying offline");
        }
      } else {
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
