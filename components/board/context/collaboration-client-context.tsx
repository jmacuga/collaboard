"use client";

import { createContext, useContext } from "react";
import { CollaborationClient } from "@/lib/sync/collaboration-client";

interface CollaborationClientContextType {
  collaborationClient: CollaborationClient | null;
}

export const CollaborationClientContext =
  createContext<CollaborationClientContextType>({
    collaborationClient: null,
  });

export const useCollaborationClient = () => {
  const context = useContext(CollaborationClientContext);

  if (!context.collaborationClient) {
    throw new Error(
      "useCollaborationClient must be used within a CollaborationClientProvider"
    );
  }

  return context.collaborationClient;
};
