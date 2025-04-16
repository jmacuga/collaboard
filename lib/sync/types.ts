import { Doc, Change } from "@automerge/automerge";

import { LayerSchema } from "@/types/KonvaNodeSchema";
import { Repo, DocHandle } from "@automerge/automerge-repo";

export interface StorageConfig {
  database?: string;
  store?: string;
}

export interface DocHandleEphemeralMessagePayload<T> {
  message: T;
  // Add other required properties based on the original implementation
}

export interface IDocumentManager {
  initializeDocument(): Promise<DocHandle<LayerSchema>>;
  getHandle(): Promise<DocHandle<LayerSchema>>;
  getRepo(): Repo;
  removeLocalDocument(): Promise<void>;
}

export interface INetworkManager {
  connect(repo: Repo): Promise<void>;
  disconnect(): void;
  isConnected(): boolean;
}

export interface IDocumentSynchronizer {
  canSync(localDoc: Doc<LayerSchema>, docId: string): Promise<boolean>;
  getServerDoc(
    docId: string,
    serverRepo: Repo
  ): Promise<Doc<LayerSchema> | null>;
}
