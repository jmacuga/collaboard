import { useNetworkStatusContext } from "@/components/providers/network-status-provider";
import { useCollaborationClient } from "../context/collaboration-client-context";

export const useConnectionManager = () => {
  const collaborationClient = useCollaborationClient();
  const { networkStatus } = useNetworkStatusContext();

  const switchToOnline = async (): Promise<boolean> => {
    if (networkStatus !== "ONLINE") {
      return false;
    }
    try {
      const canConnect = await collaborationClient.canConnect();
      if (!canConnect) {
        console.log("Detected local changes - staying disconnected");
        return false;
      }

      await collaborationClient.setOnline(true);
      return true;
    } catch (error) {
      console.error("Error switching to online:", error);
      return false;
    }
  };

  const switchToOffline = async (): Promise<void> => {
    await collaborationClient.setOnline(false);
  };

  return {
    switchToOnline,
    switchToOffline,
  };
};
