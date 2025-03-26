import { useContext } from "react";
import { BoardContext } from "../context/board-context";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useClientSync } from "../context/client-doc-context";
import { useNetworkStatusContext } from "@/components/providers/network-status-provider";
import { useRouter } from "next/router";

export const LocalChangesAlert = () => {
  const clientSyncService = useClientSync();
  const { networkStatus } = useNetworkStatusContext();
  const { synced, isOnline, setIsOnline, setSynced } = useContext(BoardContext);
  const router = useRouter();
  const handleSyncChanges = async () => {
    if (networkStatus !== "ONLINE") {
      console.log("Cannot sync changes when offline");
      return;
    }
    const boardId = router.query.id as string;
    router.push(`/boards/${boardId}/preview`);
    // console.log("Syncing changes");
    // await clientSyncService.connect();
    // setIsOnline(true);
    // setSynced(true);
  };

  if (synced || networkStatus === "OFFLINE" || isOnline) {
    return null;
  }

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg shadow-lg">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <AlertCircle
              className="h-5 w-5 text-yellow-400"
              aria-hidden="true"
            />
          </div>
          <div className="ml-3">
            <p className="text-sm text-yellow-700">
              You have local changes that need to be synced with the server.
              Please create a Merge Request to sync your changes.
            </p>
            <div className="mt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleSyncChanges}
                className="bg-white hover:bg-yellow-50"
              >
                Go to Preview
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
