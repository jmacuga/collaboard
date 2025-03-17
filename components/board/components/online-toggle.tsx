import { Wifi, WifiOff } from "lucide-react";
import { useContext } from "react";
import { BoardContext } from "../context/board-context";
import { useNetworkStatusContext } from "@/components/providers/network-status-provider";
import useToggleOnline from "../hooks/use-toggle-online";

const OnlineToggle = () => {
  const { isOnline } = useContext(BoardContext);
  const { networkStatus } = useNetworkStatusContext();
  const { toggleOnlineMode } = useToggleOnline();
  const isDisabled = !isOnline && networkStatus !== "ONLINE";

  return (
    <div className="fixed bottom-6 right-6">
      <button
        onClick={toggleOnlineMode}
        disabled={isDisabled}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all transform hover:scale-105
          ${
            isOnline
              ? "bg-green-500 text-white"
              : isDisabled
              ? "bg-gray-400 text-white cursor-not-allowed opacity-70"
              : "bg-gray-500 text-white"
          }`}
        title={
          isDisabled
            ? "Cannot switch to online mode when network is offline"
            : isOnline
            ? "Switch to Offline Mode"
            : "Switch to Online Mode"
        }
      >
        {isOnline ? (
          <>
            <Wifi className="w-5 h-5" />
            <span>Online</span>
          </>
        ) : (
          <>
            <WifiOff className="w-5 h-5" />
            <span>Offline</span>
          </>
        )}
      </button>
    </div>
  );
};

export { OnlineToggle };
