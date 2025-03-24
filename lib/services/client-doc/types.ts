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
  createLocalDocFromServerDoc(): Promise<DocHandle<LayerSchema> | null>;
  setOnline(online: boolean): void;
  canConnect(): boolean;
  getRepo(): Repo | null;
  connect(): void;
  disconnect(): void;
  getDocUrl(): string;
  updateServerData(docUrl: string): void;
  createLocalDocFromServerDoc(): Promise<DocHandle<LayerSchema> | null>;
  syncLocalRepo(): Promise<void>;
  setOnline(online: boolean): void;
  getActiveUsers(): Promise<string[]>;
  deleteDoc(): void;
}
