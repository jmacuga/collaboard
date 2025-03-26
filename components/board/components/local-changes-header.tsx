import { useContext } from "react";
import { BoardContext } from "../context/board-context";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNetworkStatusContext } from "@/components/providers/network-status-provider";
import { useRouter } from "next/router";

export const LocalChangesHeader = () => {
  const { networkStatus } = useNetworkStatusContext();
  const { synced, isOnline } = useContext(BoardContext);
  const router = useRouter();
  const handleSyncChanges = async () => {
    if (networkStatus !== "ONLINE") {
      console.log("Cannot sync changes when offline");
      return;
    }
    const boardId = router.query.id as string;
    router.push(`/boards/${boardId}/preview`);
  };

  if (synced || networkStatus === "OFFLINE" || isOnline) {
    return null;
  }

  return (
    <div className="w-full bg-yellow-50 border-b border-yellow-400">
      <div className="max-w-7xl mx-auto px-4 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <AlertCircle
              className="h-4 w-4 text-yellow-400"
              aria-hidden="true"
            />
            <p className="text-sm text-yellow-700">
              You have local changes that need to be synced
            </p>
          </div>
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
  );
};
