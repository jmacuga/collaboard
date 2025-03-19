import { useContext, useEffect } from "react";
import { BoardContext } from "../context/board-context";
import { useNetworkStatusContext } from "@/components/providers/network-status-provider";
import { useClientSync } from "@/components/board/context/client-doc-context";
import { useSession } from "next-auth/react";
import { useLocalAwareness } from "@automerge/automerge-repo-react-hooks";
import { AnyDocumentId, DocHandle } from "@automerge/automerge-repo";
import { useHandle } from "@automerge/automerge-repo-react-hooks";
import { LayerSchema } from "@/types/KonvaNodeSchema";

const useToggleOnline = () => {
  const clientSyncService = useClientSync();
  const { isOnline, setIsOnline } = useContext(BoardContext);
  const { networkStatus } = useNetworkStatusContext();
  const { data: session } = useSession();
  const handle = useHandle<LayerSchema>(
    clientSyncService.getDocUrl() as AnyDocumentId
  );

  const [localAwareness, setLocalAwareness] = useLocalAwareness({
    handle: handle as DocHandle<unknown>,
    userId: session?.user.id as string,
    initialState: [],
  });

  useEffect(() => {
    if (networkStatus === "OFFLINE") {
      setIsOnline(false);
      const setOfflineMode = async () => {
        try {
          setLocalAwareness(null);
          await clientSyncService.setOnline(false);
        } catch (error: unknown) {
          console.error("Failed to set offline mode:", error);
        }
      };
      setOfflineMode();
    }
  }, [networkStatus, clientSyncService]);

  const toggleOnlineMode = async () => {
    try {
      if (!isOnline && networkStatus !== "ONLINE") {
        console.warn("Cannot switch to online mode when network is offline");
        return;
      }
      if (isOnline) {
        try {
          setLocalAwareness(null);
        } catch (error) {
          console.error("Error setting local awareness", error);
        }
      }
      await clientSyncService.setOnline(!isOnline);
      setIsOnline(!isOnline);
    } catch (error) {
      console.error("Failed to toggle online mode:", error);
    }
  };
  return { toggleOnlineMode };
};

export default useToggleOnline;
