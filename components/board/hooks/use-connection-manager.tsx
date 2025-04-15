import { useNetworkStatusContext } from "@/components/providers/network-status-provider";
import { useClientSync } from "../context/client-sync-context";

export const useConnectionManager = () => {
  const clientSyncService = useClientSync();
  const { networkStatus } = useNetworkStatusContext();

  const switchToOnline = async (): Promise<boolean> => {
    if (networkStatus !== "ONLINE") {
      return false;
    }

    const canConnect = await clientSyncService.canConnect();
    if (!canConnect) {
      console.log("Detected local changes - staying disconnected");
      return false;
    }

    await clientSyncService.setOnline(true);
    return true;
  };

  const switchToOffline = async (): Promise<void> => {
    await clientSyncService.setOnline(false);
  };

  return {
    switchToOnline,
    switchToOffline,
  };
};
