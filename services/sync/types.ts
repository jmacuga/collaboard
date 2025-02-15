import { Repo } from "@automerge/automerge-repo";

export interface ClientSyncStatus {
  isOnline: boolean;
  lastSynced: Date | null;
  isSyncing: boolean;
  isSynced: boolean;
}

export interface ISyncService {
  createBoardData(): string;
  initialize(): { localRepo: Repo; localDocUrl: string };
  getLocalDocUrl(): string;
  getServerDocUrl(): string;
  //   getSyncStatus(): ClientSyncStatus;
  //   onStatusChange(callback: (status: ClientSyncStatus) => void): void;
  //   getIsLocalSynced(): boolean;
  //   getMergeResult(): KonvaNodeSchema & Record<string, any>;
  //   applyLocalChanges(changes: Uint8Array[]): void;
  //   discardLocalChanges(): void;
  connectToServer(docUrl: string): void;
  deleteLocalDoc(): void;
  deleteServerDoc(): void;
  //   disconnectFromServer(): void;
}
