import { useEffect, useState } from "react";
import {
  NetworkStatus,
  NetworkStatusMonitor,
} from "@/lib/network-status-monitor";

const networkMonitor = new NetworkStatusMonitor({
  pingEndpoint: "/api/ping",
  checkDelay: 3000,
});

export const useNetworkStatus = () => {
  const [state, setState] = useState(networkMonitor.getCurrentStatus());

  useEffect(() => {
    const unsubscribe = networkMonitor.subscribe((status, prevStatus) => {
      setState({ networkStatus: status, prevNetworkStatus: prevStatus });
    });

    return () => unsubscribe();
  }, []);

  return {
    ...state,
    isStatusChange: state.networkStatus !== state.prevNetworkStatus,
  };
};
