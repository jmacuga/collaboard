import { Wifi, WifiOff } from "lucide-react";
import { useContext } from "react";
import { BoardContext } from "../context/board-context";

const OnlineToggle = () => {
  const { isOnline, toggleOnlineMode } = useContext(BoardContext);

  return (
    <div className="fixed bottom-6 right-6">
      <button
        onClick={toggleOnlineMode}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all transform hover:scale-105
          ${isOnline ? "bg-green-500 text-white" : "bg-gray-500 text-white"}`}
        title={isOnline ? "Switch to Offline Mode" : "Switch to Online Mode"}
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
