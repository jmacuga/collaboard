import { useNetworkStatusContext } from "@/components/providers/network-status-provider";
import { cn } from "@/lib/utils";
import { WifiIcon, WifiOffIcon, HelpCircleIcon } from "lucide-react";
import { useState, useEffect } from "react";

interface NetworkStatusBadgeProps {
  className?: string;
}

export const NetworkStatusBadge = ({ className }: NetworkStatusBadgeProps) => {
  const [mounted, setMounted] = useState(false);
  const { networkStatus } = useNetworkStatusContext();

  // Only render on client-side to prevent hydration mismatches
  useEffect(() => {
    setMounted(true);
  }, []);

  const getStatusColor = () => {
    switch (networkStatus) {
      case "ONLINE":
        return "bg-green-500";
      case "OFFLINE":
        return "bg-red-500";
      case "UNKNOWN":
        return "bg-amber-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusIcon = () => {
    switch (networkStatus) {
      case "ONLINE":
        return <WifiIcon className="h-4 w-4" />;
      case "OFFLINE":
        return <WifiOffIcon className="h-4 w-4" />;
      case "UNKNOWN":
        return <HelpCircleIcon className="h-4 w-4" />;
      default:
        return <HelpCircleIcon className="h-4 w-4" />;
    }
  };

  const getStatusText = () => {
    switch (networkStatus) {
      case "ONLINE":
        return "Connected";
      case "OFFLINE":
        return "Disconnected";
      case "UNKNOWN":
        return "Checking...";
      default:
        return "Unknown";
    }
  };

  // Return a placeholder during SSR to prevent hydration mismatches
  if (!mounted) {
    return null;
  }

  return (
    <div
      className={cn(
        "fixed bottom-6 left-6 flex items-center gap-2 px-3 py-1.5 rounded-lg text-white text-sm shadow-md",
        getStatusColor(),
        className
      )}
      aria-label={`Network status: ${getStatusText()}`}
    >
      {getStatusIcon()}
      <span className="font-medium">{getStatusText()}</span>
    </div>
  );
};
