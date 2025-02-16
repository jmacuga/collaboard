export interface ClientSyncStatus {
  isOnline: boolean;
  lastSynced: Date | null;
  isSyncing: boolean;
  isSynced: boolean;
}

export interface IClientSyncService {
  create(docUrl: string): Promise<IClientSyncService>;
  getDocUrl(): string;
  //   getSyncStatus(): ClientSyncStatus;
  //   onStatusChange(callback: (status: ClientSyncStatus) => void): void;
  //   getIsLocalSynced(): boolean;
  //   getMergeResult(): KonvaNodeSchema & Record<string, any>;
  //   applyLocalChanges(changes: Uint8Array[]): void;
  //   discardLocalChanges(): void;
  updateServerData(docUrl: string): void;
  connect(): void;
  canConnect(): boolean;
  deleteDoc(): void;
  //   disconnectFromServer(): void;
}
