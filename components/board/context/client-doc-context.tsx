"use client";

import { ClientDocService } from "@/lib/services/client-doc/client-doc-service";
import { createContext, useContext } from "react";

interface ClientDocContextType {
  clientDocService: ClientDocService | null;
}

export const ClientDocContext = createContext<ClientDocContextType>({
  clientDocService: null,
});

export const useClientDoc = () => {
  const context = useContext(ClientDocContext);

  if (!context) {
    throw new Error("useClientDoc must be used within a ClientDocProvider");
  }

  if (!context.clientDocService) {
    throw new Error("ClientDocService is not initialized");
  }

  return context.clientDocService;
};
