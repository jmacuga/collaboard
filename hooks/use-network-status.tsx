import { useState, useEffect, useRef } from "react";

export type NetworkStatus = "ONLINE" | "OFFLINE" | "UNKNOWN";

/**
 * Custom hook to monitor network status (online/offline)
 * @returns An object containing the current network status
 */
export const useNetworkStatus = () => {
  const [networkStatus, setNetworkStatus] = useState<NetworkStatus>("UNKNOWN");
  const prevNetworkStatusRef = useRef<NetworkStatus>("UNKNOWN");
  const isInitialMount = useRef(true);
  const hasMounted = useRef(false);

  useEffect(() => {
    hasMounted.current = true;

    if (typeof navigator !== "undefined") {
      setNetworkStatus(navigator.onLine ? "ONLINE" : "OFFLINE");
    }

    return () => {
      hasMounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    prevNetworkStatusRef.current = networkStatus;
  }, [networkStatus]);

  useEffect(() => {
    if (!hasMounted.current || typeof window === "undefined") {
      return;
    }

    const checkServerConnection = () => {
      if (networkStatus === "UNKNOWN" && hasMounted.current) {
        fetch("/api/ping", { cache: "no-store" })
          .then(() => {
            if (
              prevNetworkStatusRef.current !== "ONLINE" &&
              hasMounted.current
            ) {
              setNetworkStatus("ONLINE");
            }
          })
          .catch(() => {
            if (hasMounted.current) {
              setNetworkStatus("UNKNOWN");
            }
          });
      }
    };

    const timeout = setTimeout(checkServerConnection, 1000);

    const handleOnline = () => {
      console.log("online event triggered");
      if (hasMounted.current) {
        setNetworkStatus("UNKNOWN");
      }
    };

    const handleOffline = () => {
      console.log("offline event triggered");
      if (hasMounted.current) {
        setNetworkStatus("OFFLINE");
      }
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      clearTimeout(timeout);
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [networkStatus]);

  return {
    networkStatus,
    prevNetworkStatus: prevNetworkStatusRef.current,
    isStatusChange:
      networkStatus !== prevNetworkStatusRef.current && !isInitialMount.current,
  };
};
