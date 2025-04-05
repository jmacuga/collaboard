import { LayerSchema } from "@/types/KonvaNodeSchema";
import { DocHandle, Repo } from "@automerge/automerge-repo";

export interface ClientSyncStatus {
  isOnline: boolean;
  lastSynced: Date | null;
  isSyncing: boolean;
  isSynced: boolean;
}

export interface IClientSyncService {
  initializeRepo(): Promise<DocHandle<LayerSchema> | null>;
  getDocUrl(): string;
  setOnline(online: boolean): void;
  canConnect(): Promise<boolean>;
  getRepo(): Repo | null;
  connect(): void;
  disconnect(): void;
  getActiveUsers(): Promise<string[]>;
  deleteDoc(): void;
  removeLocalDoc(): Promise<void>;
}

export interface StorageConfig {
  database: string;
  store: string;
}
