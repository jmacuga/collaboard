"use client";

import { ClientSyncService } from "@/lib/services/client-doc/client-doc-service";
import { createContext, useContext } from "react";

interface ClientSyncContextType {
  clientSyncService: ClientSyncService | null;
}

export const ClientSyncContext = createContext<ClientSyncContextType>({
  clientSyncService: null,
});

export const useClientSync = () => {
  const context = useContext(ClientSyncContext);

  if (!context) {
    throw new Error("useClientSync must be used within a ClientSyncProvider");
  }

  if (!context.clientSyncService) {
    throw new Error("ClientSyncService is not initialized");
  }

  return context.clientSyncService;
};
