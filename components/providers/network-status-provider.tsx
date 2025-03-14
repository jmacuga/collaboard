import {
  createContext,
  useContext,
  ReactNode,
  useEffect,
  useState,
} from "react";
import { useNetworkStatus, NetworkStatus } from "@/hooks/use-network-status";
import { toast } from "react-hot-toast";

interface NetworkStatusContextType {
  networkStatus: NetworkStatus;
}

const NetworkStatusContext = createContext<NetworkStatusContextType>({
  networkStatus: "UNKNOWN",
});

export const useNetworkStatusContext = () => {
  return useContext(NetworkStatusContext);
};

interface NetworkStatusProviderProps {
  children: ReactNode;
}

export const NetworkStatusProvider = ({
  children,
}: NetworkStatusProviderProps) => {
  const [mounted, setMounted] = useState(false);
  const { networkStatus, prevNetworkStatus, isStatusChange } =
    useNetworkStatus();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    if (isStatusChange) {
      if (networkStatus === "ONLINE" && prevNetworkStatus === "OFFLINE") {
        toast.success("You are back online", {
          id: "network-status",
          duration: 3000,
        });
      } else if (networkStatus === "OFFLINE") {
        toast.error("You are offline. Changes will be saved locally.", {
          id: "network-status",
          duration: 5000,
        });
      }
    }
  }, [networkStatus, prevNetworkStatus, isStatusChange, mounted]);

  return (
    <NetworkStatusContext.Provider value={{ networkStatus }}>
      {children}
    </NetworkStatusContext.Provider>
  );
};
