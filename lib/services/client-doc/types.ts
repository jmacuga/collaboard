export interface ClientSyncStatus {
  isOnline: boolean;
  lastSynced: Date | null;
  isSyncing: boolean;
  isSynced: boolean;
}

export interface IClientDocService {
  create(serverDocUrl: string): Promise<IClientDocService>;
  getLocalDocUrl(): string;
  getServerDocUrl(): string;
  //   getSyncStatus(): ClientSyncStatus;
  //   onStatusChange(callback: (status: ClientSyncStatus) => void): void;
  //   getIsLocalSynced(): boolean;
  //   getMergeResult(): KonvaNodeSchema & Record<string, any>;
  //   applyLocalChanges(changes: Uint8Array[]): void;
  //   discardLocalChanges(): void;
  updateServerData(docUrl: string): void;
  connectToServer(docUrl: string): void;
  deleteDoc(): void;
  //   disconnectFromServer(): void;
}
