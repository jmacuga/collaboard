import { useNetworkStatusContext } from "@/components/providers/network-status-provider";
import { cn } from "@/lib/utils";
import { WifiIcon, WifiOffIcon, HelpCircleIcon } from "lucide-react";
import { useState, useEffect } from "react";

interface NetworkStatusIndicatorProps {
  className?: string;
  showText?: boolean;
}

export const NetworkStatusIndicator = ({
  className,
  showText = false,
}: NetworkStatusIndicatorProps) => {
  const [mounted, setMounted] = useState(false);
  const { networkStatus } = useNetworkStatusContext();

  useEffect(() => {
    setMounted(true);
  }, []);

  const getStatusColor = () => {
    switch (networkStatus) {
      case "ONLINE":
        return "text-green-500";
      case "OFFLINE":
        return "text-red-500";
      case "UNKNOWN":
        return "text-amber-500";
      default:
        return "text-gray-500";
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
        return "Online";
      case "OFFLINE":
        return "Offline";
      case "UNKNOWN":
        return "Checking...";
      default:
        return "Unknown";
    }
  };

  if (!mounted) {
    return <div className={cn("h-4 w-4", className)} />;
  }

  return (
    <div
      className={cn("flex items-center gap-x-2", getStatusColor(), className)}
      aria-label={getStatusText()}
      tabIndex={0}
    >
      {getStatusIcon()}
      {showText && (
        <span className="text-xs font-medium">{getStatusText()}</span>
      )}
    </div>
  );
};
