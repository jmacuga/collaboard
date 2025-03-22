import { useContext, useEffect } from "react";
import { BoardContext } from "../context/board-context";
import { useNetworkStatusContext } from "@/components/providers/network-status-provider";
import { useClientSync } from "@/components/board/context/client-doc-context";
import { useSession } from "next-auth/react";
import { useLocalAwareness } from "@automerge/automerge-repo-react-hooks";
import { AnyDocumentId, DocHandle } from "@automerge/automerge-repo";
import { useHandle } from "@automerge/automerge-repo-react-hooks";
import { LayerSchema } from "@/types/KonvaNodeSchema";

const useSyncMode = () => {
  const clientSyncService = useClientSync();
  const { isOnline, setIsOnline } = useContext(BoardContext);
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
      await clientSyncService.setOnline(!isOnline);
      setIsOnline(!isOnline);
    } catch (error) {
      console.error("Failed to toggle real-time/local mode:", error);
    }
  };
  return { toggleSyncMode };
};

export default useSyncMode;
