import { KonvaNodeSchema } from "@/types/KonvaNodeSchema";
import { DocHandle } from "@automerge/automerge-repo";

export interface ClientSyncStatus {
  isOnline: boolean;
  lastSynced: Date | null;
  isSyncing: boolean;
  isSynced: boolean;
}

export interface IClientSyncService {
  getDocUrl(): string;
  //   getSyncStatus(): ClientSyncStatus;
  //   onStatusChange(callback: (status: ClientSyncStatus) => void): void;
  //   getIsLocalSynced(): boolean;
  //   getMergeResult(): KonvaNodeSchema & Record<string, any>;
  //   applyLocalChanges(changes: Uint8Array[]): void;
  //   discardLocalChanges(): void;
  updateServerData(docUrl: string): void;
  connect(): void;
  disconnect(): void;
  canConnect(): boolean;
  deleteDoc(): void;
  initializeRepo(): Promise<void>;
  createLocalDocFromServerDoc(): Promise<DocHandle<KonvaNodeSchema> | null>;
}
