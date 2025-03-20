import {
  Wifi,
  WifiOff,
  HelpCircleIcon,
  InfoIcon,
  CloudOff,
  AlertCircle,
} from "lucide-react";
import { useState, useEffect, useContext } from "react";
import { BoardContext } from "../context/board-context";
import { useNetworkStatusContext } from "@/components/providers/network-status-provider";
import useSyncMode from "../hooks/use-sync-mode";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export const SyncStatusControl = () => {
  const [mounted, setMounted] = useState(false);
  const { isOnline } = useContext(BoardContext);
  const { networkStatus } = useNetworkStatusContext();
  const { toggleSyncMode } = useSyncMode();
  const isDisabled = !isOnline && networkStatus !== "ONLINE";

  // Only render on client-side to prevent hydration mismatches
  useEffect(() => {
    setMounted(true);
  }, []);

  const getNetworkStatusIcon = () => {
    switch (networkStatus) {
      case "ONLINE":
        return (
          <div className="relative flex items-center justify-center">
            <Wifi className="h-4 w-4 text-green-500 transition-colors" />
            <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
          </div>
        );
      case "OFFLINE":
        return <WifiOff className="h-4 w-4 text-red-500 transition-colors" />;
      case "UNKNOWN":
        return (
          <AlertCircle className="h-4 w-4 text-amber-500 animate-pulse transition-colors" />
        );
      default:
        return (
          <HelpCircleIcon className="h-4 w-4 text-gray-500 transition-colors" />
        );
    }
  };

  const getNetworkStatusText = () => {
    switch (networkStatus) {
      case "ONLINE":
        return "Network Available";
      case "OFFLINE":
        return "Network Offline";
      case "UNKNOWN":
        return "Checking Connection...";
      default:
        return "Unknown";
    }
  };

  const getTooltipMessage = () => {
    if (networkStatus === "ONLINE" && isOnline) {
      return "You are in real-time mode with network connection. Changes are synced immediately.";
    } else if (networkStatus === "ONLINE" && !isOnline) {
      return "You are in local mode despite having network connection. Changes are stored locally until you switch to real-time mode.";
    } else if (networkStatus === "OFFLINE") {
      return "No network connection available. You are working in local mode. Changes will be stored locally until network is restored.";
    } else {
      return "Network status is being checked...";
    }
  };

  // Return a placeholder during SSR to prevent hydration mismatches
  if (!mounted) {
    return null;
  }

  return (
    <TooltipProvider delayDuration={300}>
      <div className="bg-white/95 shadow-lg rounded-lg px-4 py-2.5 flex items-center gap-4 border border-gray-200 backdrop-blur-sm transition-all hover:shadow-md">
        {/* Network Status with Tooltip */}
        <Tooltip>
          <TooltipTrigger asChild>
            <div
              className="flex items-center cursor-help p-0.5 w-5 h-5 justify-center"
              aria-label={`Network status: ${getNetworkStatusText()}`}
            >
              {getNetworkStatusIcon()}
            </div>
          </TooltipTrigger>
          <TooltipContent
            side="top"
            align="start"
            className="max-w-xs p-2.5 text-xs bg-gray-800 text-white border-gray-700"
          >
            <div className="font-semibold mb-1.5 flex items-center gap-1.5">
              {networkStatus === "ONLINE" ? (
                <Wifi className="h-3.5 w-3.5 text-green-400" />
              ) : (
                <WifiOff className="h-3.5 w-3.5 text-red-400" />
              )}
              {getNetworkStatusText()}
            </div>
            <p className="text-gray-200 leading-relaxed">
              {getTooltipMessage()}
            </p>
          </TooltipContent>
        </Tooltip>

        {/* Separator */}
        <div className="h-5 w-px bg-gray-200" aria-hidden="true"></div>

        {/* Mode Switch with Labels */}
        <div className="flex items-center gap-3">
          <span
            className={cn(
              "text-xs font-medium transition-colors whitespace-nowrap",
              !isOnline ? "text-gray-900" : "text-gray-400"
            )}
          >
            Local
          </span>

          {/* Shadcn Switch */}
          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <Switch
                  checked={isOnline}
                  onCheckedChange={isDisabled ? undefined : toggleSyncMode}
                  disabled={isDisabled}
                  className={cn(
                    "transition-opacity",
                    isDisabled
                      ? "opacity-50 cursor-not-allowed"
                      : "cursor-pointer",
                    isOnline &&
                      "data-[state=checked]:bg-green-500 data-[state=checked]:border-green-600"
                  )}
                  aria-label={
                    isOnline
                      ? "Switch to Local Mode"
                      : "Switch to Real-time Mode"
                  }
                />
              </div>
            </TooltipTrigger>
            <TooltipContent
              side="top"
              className="p-2 text-xs bg-gray-800 text-white border-gray-700"
            >
              {isDisabled
                ? "Cannot switch to real-time mode when network is offline"
                : isOnline
                ? "Switch to Local Mode"
                : "Switch to Real-time Mode"}
            </TooltipContent>
          </Tooltip>

          <span
            className={cn(
              "text-xs font-medium transition-colors whitespace-nowrap",
              isOnline ? "text-gray-900" : "text-gray-400"
            )}
          >
            Real-time
          </span>
        </div>
      </div>
    </TooltipProvider>
  );
};
